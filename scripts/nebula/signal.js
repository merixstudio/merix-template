/*
 * Simple signal dispatcher implementation.
 */
define('nebula/signal', ['nebula/utils/callable'], function(callable) {
    'use strict';

    function Signal() {
        this.receivers = [];
    }

    Signal = callable(Signal);

    Signal.prototype.connect = function() {
        var kwargs = typeof arguments[0] === 'function' ? {'receiver': arguments[0]} : arguments[0];
        if (typeof kwargs.receiver !== 'function')
            throw new Error("can't connect receiver to a signal, receiver is not a function");
        for (var i = 0; i < this.receivers.length; i++)
            if (this.receivers[i].receiver === kwargs.receiver)
                return;
        this.receivers.push({'receiver': kwargs.receiver, 'sender': kwargs.sender, 'context': kwargs.context});
    };

    Signal.prototype.__call__ = Signal.prototype.connect;

    Signal.prototype.disconnect = function() {
        var kwargs = typeof arguments[0] === 'function' ? {'receiver': arguments[0]} : arguments[0];
        for (var i = 0; i < this.receivers.length; i++)
            if (this.receivers[i].receiver === kwargs.receiver) {
                this.receivers.splice(i, 1);
                return;
            }
    };

    Signal.prototype.send = function(sender) {
        // Execute all connected receivers, forwarding all arguments.
        for (var i = 0; i < this.receivers.length; i++) {
            var entry = this.receivers[i];
            if (typeof entry.sender === 'undefined' || entry.sender === sender)
                entry.receiver.apply(entry.context, arguments);
        }
    };

    return Signal;
});
