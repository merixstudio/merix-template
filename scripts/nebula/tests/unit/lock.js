describe('lock.js', function() {
    var Lock = require('nebula/lock');

    function expectOpenedLock(lock) {
        expect(lock._isOpen()).toBe(true);
        expect(lock._isLocked()).toBe(false);
        expect(lock._isActive()).toBe(false);
    }

    function expectClosedLock(lock) {
        expect(lock._isOpen()).toBe(false);
        expect(lock._isLocked()).toBe(true);
        expect(lock._isActive()).toBe(true);
    }

    it('creates initially open locks', function() {
        var lockA = new Lock();
        var lockB = new Lock(false);
        expectOpenedLock(lockA);
        expectOpenedLock(lockB);
    });

    it('can create initially closed locks', function() {
        var lock = new Lock(true);
        expectClosedLock(lock);
    });

    it('allows to acquire a lock', function() {
        var lock = new Lock();
        lock.acquire();
        expectClosedLock(lock);
    });

    it('allows to acquire and release a lock one or many times', function() {
        var lock = new Lock();
        lock.acquire();
        lock.release();
        expectOpenedLock(lock);

        lock.acquire();
        lock.acquire();
        lock.release();
        lock.release();
        expectOpenedLock(lock);
    });

    it("doesn't release a lock that was acquired more times than released", function() {
        var lock = new Lock();
        for (var i = 1; i <= 10; i++)
            lock.acquire();
        for (var i = 1; i <= 9; i++) {
            lock.release();
            expectClosedLock(lock);
        }
        lock.release();
        expectOpenedLock(lock);
    });

    describe('`Lock` can be used to decorate objects', function() {
        function decorate(object) {
            object.lock = new Lock(object, 'pause', 'resume');
        }

        it("doesn't throw errors on basic usage", function() {
            var o = {'pause': function() {}, 'resume': function() {}};
            expect(decorate.bind(undefined, o)).not.toThrow();
            expect(o.lock instanceof Lock).toBe(true);
        });

        it("creates initially open locks", function() {
            var o = {'pause': function() {}, 'resume': function() {}};
            decorate(o);
            expectOpenedLock(o.lock);
        });

        it('allows to acquire and release a lock one or many times', function() {
            var o = {'pause': function() {}, 'resume': function() {}};
            decorate(o);
            o.pause();
            o.resume();
            expectOpenedLock(o.lock);

            o.pause();
            o.pause();
            o.resume();
            o.resume();
            expectOpenedLock(o.lock);
        });

        it("doesn't release a lock that was acquired more times than released", function() {
            var o = {'pause': function() {}, 'resume': function() {}};
            decorate(o);
            for (var i = 1; i <= 10; i++)
                o.pause();
            for (var i = 1; i <= 9; i++) {
                o.resume();
                expectClosedLock(o.lock);
            }
            o.resume();
            expectOpenedLock(o.lock);
        });

        it("calls an original method on lock acquire", function() {
            var acquire = jasmine.createSpy();
            var o = {'pause': acquire, 'resume': function() {}};
            decorate(o);
            o.pause();
            expectClosedLock(o.lock);
            expect(acquire).toHaveBeenCalled();
        });

        it("calls an original method on lock release", function() {
            var release = jasmine.createSpy();
            var o = {'pause': function() {}, 'resume': release};
            decorate(o);
            o.pause();
            o.resume();
            expectOpenedLock(o.lock);
            expect(release).toHaveBeenCalled();
        });

        it("calls original methods only on the first lock acquire and last lock release", function() {
            var acquire = jasmine.createSpy();
            var release = jasmine.createSpy();
            var o = {'pause': acquire, 'resume': release};
            decorate(o);
            for (var i = 1; i <= 10; i++)
                o.pause();
            expect(acquire.calls.count()).toBe(1);
            for (var i = 1; i <= 10; i++)
                o.resume();
            expect(release.calls.count()).toBe(1);
            o.pause();
            expect(acquire.calls.count()).toBe(2);
            o.resume();
            expect(release.calls.count()).toBe(2);
        });

        it('sets properly context when calling decorated methods', function() {
            var acquire = jasmine.createSpy();
            var release = jasmine.createSpy();
            var o = {'pause': acquire, 'resume': release};
            decorate(o);
            o.pause();
            o.resume();
            expect(acquire.calls.first().object).toBe(o);
            expect(release.calls.first().object).toBe(o);
        });

        it('forwards all arguments when calling decorated methods', function() {
            var acquire = jasmine.createSpy();
            var release = jasmine.createSpy();
            var o = {'pause': acquire, 'resume': release};
            decorate(o);
            o.pause(1, 2, 3);
            o.resume(1, 2, 3);
            expect(acquire).toHaveBeenCalledWith(1, 2, 3);
            expect(release).toHaveBeenCalledWith(1, 2, 3);
        });

        it('returns values from the decorated methods', function() {
            var acquire = jasmine.createSpy().and.returnValue(11);
            var release = jasmine.createSpy().and.returnValue(22);
            var o = {'pause': acquire, 'resume': release};
            decorate(o);
            expect(o.pause()).toBe(11);
            expect(o.resume()).toBe(22);
        });

        it("throws an exception if an object doesn't have one of the required methods", function() {
            var acquireMissing = {'pause': function() {}};
            var releaseMissing = {'resume': function() {}};
            var bothMissing = {};
            expect(decorate.bind(undefined, acquireMissing)).toThrow();
            expect(decorate.bind(undefined, releaseMissing)).toThrow();
            expect(decorate.bind(undefined, bothMissing)).toThrow();
        });
    });
});
