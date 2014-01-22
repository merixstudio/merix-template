describe('viewport.js', function() {
    var viewport = require('nebula/viewport');
    var test = require('nebula/test');

    var win = {
        'addEventListener': null,
        'removeEventListener': null,
        'document': {
            'body': {'classList': {'add': null, 'remove': null}},
            'documentElement': null
        }
    };

    beforeEach(function() {
        win.addEventListener = jasmine.createSpy('window.addEventListener');
        win.removeEventListener = jasmine.createSpy('window.removeEventListener'),
        win.document.body.classList.add = jasmine.createSpy('document.body.classList.add');
        win.document.body.classList.remove = jasmine.createSpy('document.body.classList.remove');
        win.document.documentElement = {'clientWidth': 1, 'clientHeight': 1};
        viewport.enable(win);
    });

    afterEach(function() {
        viewport.disable();
    });

    it('allows to check for window width', function() {
        expect(viewport.width()).toBe(1);
    });

    it('allows to check for window height', function() {
        expect(viewport.height()).toBe(1);
    });

    it('detects properly portrait mode', function() {
        win.document.documentElement = {'clientWidth': 1, 'clientHeight': 1};
        viewport._update();
        expect(viewport.isPortrait()).toBe(true);
        expect(viewport.isLandscape()).toBe(false);
    });

    it('detects properly landscape mode', function() {
        win.document.documentElement = {'clientWidth': 2, 'clientHeight': 1};
        viewport._update();
        expect(viewport.isPortrait()).toBe(false);
        expect(viewport.isLandscape()).toBe(true);
    });

    it("changes active viewport when window's width changes", function() {
        var customSettings = {'VIEWPORTS': {'A': [0, 1], 'B': [2, 3], 'C': [4, Infinity]}};

        test.overrideSettings(customSettings, function() {
            viewport._update();
            expect(viewport.get()).toBe('A');

            win.document.documentElement.clientWidth = 2;
            viewport._update();
            expect(viewport.get()).toBe('B');

            win.document.documentElement.clientWidth = 3;
            viewport._update();
            expect(viewport.get()).toBe('B');

            win.document.documentElement.clientWidth = 4;
            viewport._update();
            expect(viewport.get()).toBe('C');
            win.document.documentElement.clientWidth = 5;
            viewport._update();
            expect(viewport.get()).toBe('C');
        });
    });

    it("doesn't activate an incorrect viewport", function() {
        var customSettings = {'VIEWPORTS': {'A': [2, 3]}};

        test.overrideSettings(customSettings, function() {
            viewport._update();
            expect(viewport.get()).toBe(null);
        });
    });


    it("calls a viewport specification if it's a function", function() {
        var customSettings = {'VIEWPORTS': {'A': jasmine.createSpy().and.returnValue(true)}};

        test.overrideSettings(customSettings, function() {
            viewport._update();
            expect(customSettings.VIEWPORTS.A).toHaveBeenCalled();
            expect(viewport.get()).toBe('A');
        });
    });

    it("adds an appropriate body class when viewport changes", function() {
        var customSettings = {'VIEWPORTS': {'A': [0, 1], 'B': [2, 3]}};

        test.overrideSettings(customSettings, function() {
            viewport._update();
            expect(win.document.body.classList.add).toHaveBeenCalledWith('viewport-A');

            win.document.documentElement.clientWidth = 2;
            viewport._update();
            expect(win.document.body.classList.remove).toHaveBeenCalledWith('viewport-A');
            expect(win.document.body.classList.add).toHaveBeenCalledWith('viewport-B');
        });
    });

    it("sends the `onChange` signal when active viewport changes", function() {
        var customSettings = {'VIEWPORTS': {'A': [0, 1], 'B': [2, 3]}};
        var onChangeCallback = jasmine.createSpy('onChangeCallback');

        viewport.onChange.connect(onChangeCallback);

        test.overrideSettings(customSettings, function() {
            viewport.disable();
            viewport.enable(win);
            viewport._update();
            expect(onChangeCallback.calls.count()).toBe(1);

            win.document.documentElement.clientWidth = 2;
            viewport._update();
            expect(onChangeCallback.calls.count()).toBe(2);
        });
    });

    it("throws an error when a viewport specification is invalid", function() {
        test.overrideSettings({'VIEWPORTS': {'A': 999}}, function() {
            expect(viewport.enable.bind(null, win)).toThrow();
        });

        test.overrideSettings({'VIEWPORTS': {'A': [999]}}, function() {
            expect(viewport.enable.bind(null, win)).toThrow();
        });

        test.overrideSettings({'VIEWPORTS': {'A': [2, 1]}}, function() {
            expect(viewport.enable.bind(null, win)).toThrow();
        });

        test.overrideSettings({'VIEWPORTS': {'A': [1, 2, 3]}}, function() {
            expect(viewport.enable.bind(null, win)).toThrow();
        });
    });
});
