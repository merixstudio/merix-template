describe('smart_blocks.js', function() {
    var smartBlocks = require('nebula/smart_blocks');
    var test = require('nebula/test');
    var block, blockSpec;

    var win = {
        'addEventListener': jasmine.createSpy('window.addEventListener'),
        'removeEventListener': jasmine.createSpy('window.removeEventListener')
    };

    beforeEach(function() {
        block = {
            'offsetWidth': 1,
            'parentNode': {'offsetWidth': 1},
            'classList': {
                'add': jasmine.createSpy('block.classList.add'),
                'remove': jasmine.createSpy('block.classList.remove'),
                'contains': jasmine.createSpy('block.classList.contains')
            }
        };

        blockSpec = {
            'small': [1, 2],
            'medium': [3, 4],
            'big': [5, 6]
        };
        blockSpecSelf = {
            'self-small': [1, 2, 'self'],
            'self-medium': [3, 4, 'self'],
            'self-big': [5, 6, 'self']
        };

        smartBlocks.onUpdate.receivers = [];
        smartBlocks.enable(win);
    });

    afterEach(function() {
        smartBlocks.disable();
        win.addEventListener.calls.reset();
        win.removeEventListener.calls.reset();
    });

    describe('`updateBlock()`', function() {
        it("doesn't change block's class if no specification matches", function() {
            block.parentNode.offsetWidth = 7;
            smartBlocks.updateBlock(block, blockSpec);
            expect(block.classList.add).not.toHaveBeenCalled();
            expect(block.classList.remove).not.toHaveBeenCalled();
        });
        it("doesn't change block's class if no specification matches (when measuring self)", function() {
            block.offsetWidth = 7;
            smartBlocks.updateBlock(block, blockSpecSelf);
            expect(block.classList.add).not.toHaveBeenCalled();
            expect(block.classList.remove).not.toHaveBeenCalled();
        });
        it("adds a valid class when block specification matches", function() {
            smartBlocks.updateBlock(block, blockSpec);
            expect(block.classList.add).toHaveBeenCalledWith('small');
        });
        it("adds a valid class when block specification matches (when measuring self)", function() {
            smartBlocks.updateBlock(block, blockSpecSelf);
            expect(block.classList.add).toHaveBeenCalledWith('self-small');
        });
        it("changes block's class when other block specification matches", function() {
            smartBlocks.updateBlock(block, blockSpec);
            expect(block.classList.add).toHaveBeenCalledWith('small');

            block.classList.contains = function(cls) {
                return cls === 'small';
            };

            block.parentNode.offsetWidth = 3;
            smartBlocks.updateBlock(block, blockSpec);
            expect(block.classList.remove).toHaveBeenCalledWith('small');
            expect(block.classList.add).toHaveBeenCalledWith('medium');
        });
        it("changes block's class when other block specification matches (when measuring self)", function() {
            smartBlocks.updateBlock(block, blockSpecSelf);
            expect(block.classList.add).toHaveBeenCalledWith('self-small');

            block.classList.contains = function(cls) {
                return cls === 'self-small';
            };

            block.offsetWidth = 3;
            smartBlocks.updateBlock(block, blockSpecSelf);
            expect(block.classList.remove).toHaveBeenCalledWith('self-small');
            expect(block.classList.add).toHaveBeenCalledWith('self-medium');
        });
    });

    describe('`updateTree()`', function() {
        it("finds all elements specified by a setting", function() {
            var customSettings = {'SMART_BLOCKS': {'a': blockSpec, 'b': blockSpec, 'c': blockSpec}};
            var root = {
                'querySelectorAll': jasmine.createSpy('root.querySelectorAll').and.returnValue([block])
            };

            test.overrideSettings(customSettings, function() {
                smartBlocks.updateTree(root);
            });
            expect(root.querySelectorAll).toHaveBeenCalledWith('a');
            expect(root.querySelectorAll).toHaveBeenCalledWith('b');
            expect(root.querySelectorAll).toHaveBeenCalledWith('c');
            expect(root.querySelectorAll.calls.count()).toBe(3);
            expect(block.classList.add).toHaveBeenCalled();
            expect(block.classList.add.calls.count()).toBe(3);
        });
    });

    describe('`enable()`', function() {
        it("adds `updateDocument()` as a listener for the 'resize' event", function() {
            expect(win.addEventListener).toHaveBeenCalledWith('resize', smartBlocks.updateDocument);
        });
    });

    describe('`disable()`', function() {
        it("removes `updateDocument()` as a listener for the 'resize' event", function() {
            smartBlocks.disable();
            expect(win.removeEventListener).toHaveBeenCalledWith('resize', smartBlocks.updateDocument);
        });
    });

    describe('`onUpdate` signal', function() {
        it("is not sent if no specification matches", function() {
            var signalCheck = jasmine.createSpy('signalCheck');
            block.parentNode.offsetWidth = 7;
            smartBlocks.onUpdate.connect(signalCheck);
            smartBlocks.updateBlock(block, blockSpec);
            expect(signalCheck).not.toHaveBeenCalled();
        });
        it("is sent if specification matches", function() {
            var signalCheck = jasmine.createSpy('signalCheck');
            smartBlocks.onUpdate.connect(signalCheck);
            smartBlocks.updateBlock(block, blockSpec);
            expect(signalCheck).toHaveBeenCalled();
        });
    });
});
