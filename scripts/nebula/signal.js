/*
 * Simple signal dispatcher implementation.
 */
define('nebula/signal', function() {
    'use strict';

    function Signal() {
        this.receivers = [];
    }

    Signal.prototype.connect = function(receiver) {
        if (typeof receiver !== 'function')
            throw new Error("can't connect receiver to a signal, receiver is not a function");
        for (var i = 0; i < this.receivers.length; i++)
            if (this.receivers[i] === receiver)
                return;
        this.receivers.push(receiver);
    };

    Signal.prototype.disconnect = function(receiver) {
        for (var i = 0; i < this.receivers.length; i++)
            if (this.receivers[i] === receiver) {
                this.receivers.splice(i, 1);
                return;
            }
    };

    Signal.prototype.send = function() {
        // Execute all connected receivers, forwarding all arguments.
        for (var i = 0; i < this.receivers.length; i++)
            this.receivers[i].apply(this, arguments);
    };

    return Signal;
});
