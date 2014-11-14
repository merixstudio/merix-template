define('nebula/lock', function() {
    /*
     * Lock (AKA Counting Semaphore) have two states: can be open and closed. To request lock, call the `.acquire()`
     * method. Lock will be unlocked only when the `.release()` method was called same or more times than `.acquire()`.
     * You can also force open a lock using the `.open()` and `.reset()` methods, but this may be dangerous, depends
     * on your situation.
     *
     * Can be used as a lock instance:
     *
     *     var paused = new Lock();
     *
     * Can also be used to decorate other object's methods:
     *
     *     function SomeClass() {
     *         ...
     *         this._paused = new Lock(this, 'pause', 'resume');
     *         ...
     *     }
     *
     *     SomeClass.prototype.pause = function() { ... };
     *     SomeClass.prototype.resume = function() { ... };
     */
    'use strict';


    function Lock(stateOrObject, acquireMethodName, releaseMethodName) {
        var isState = typeof stateOrObject === 'boolean';
        this.reset(isState ? stateOrObject : undefined);
        if (!isState && stateOrObject)
            this._decorate(stateOrObject, acquireMethodName, releaseMethodName);
    }

    Lock.prototype.reset = function(locked) {
        this._count = locked ? 1 : 0;
    };

    Lock.prototype.open = function() {
        this.reset();
    };

    Lock.prototype.acquire = function() {
        this._count += 1;
    };

    Lock.prototype.release = function() {
        // Allow `release()` to be called more times than `acquire()`.
        if (this._count > 0)
            this._count -= 1;
    };

    Lock.prototype._isLocked = Lock.prototype._isActive = function() {
        /*
         * Returns `true` if lock is locked and `false` if it's open.
         */
        return this._count > 0;
    };

    Lock.prototype._isOpen = function() {
        /*
         * Returns `true` if lock is open and `false` if it's locked.
         */
        return this._count === 0;
    };


    Lock.prototype._decorate = function(object, acquireMethodName, releaseMethodName) {
        /*
         * Decorates an object in such a way that it's given methods will be called only when lock is closed or
         * opened.
         */
        if (typeof object[acquireMethodName] !== 'function')
            throw new Error("Cannot make a lock around object '" + object + "', it doesn't have method named '" + acquireMethodName + "' or it's not a function");
        if (typeof object[releaseMethodName] !== 'function')
            throw new Error("Cannot make a lock around object '" + object + "', it doesn't have method named '" + releaseMethodName + "' or it's not a function");

        var lock = this;
        var acquire = object[acquireMethodName];
        var release = object[releaseMethodName];

        object[acquireMethodName] = function() {
            var wasOpen = lock._isOpen();
            lock.acquire();
            if (wasOpen && lock._isLocked())
                return acquire.apply(this, arguments);
        };

        object[releaseMethodName] = function() {
            var wasLocked = lock._isLocked();
            lock.release();
            if (wasLocked && lock._isOpen())
                return release.apply(this, arguments);
        };
    };

    /*
     * `isActive` is an alternative name for `isLocked`, because it sometimes lookes better, e.g.:
     *
     *     var pause = new Lock();
     *     ...
     *     if (pause.isActive)
     *         ...
     */
    if (Object.defineProperty) {
        // Use these properties only when targeting IE9+. Otherwise use the `._isLocked()` and `._isOpen()` methods.
        Object.defineProperty(Lock.prototype, 'isOpen', {'get': Lock.prototype._isOpen});
        Object.defineProperty(Lock.prototype, 'isLocked', {'get': Lock.prototype._isLocked});
        Object.defineProperty(Lock.prototype, 'isActive', {'get': Lock.prototype._isActive});
    }


    return Lock;
});
