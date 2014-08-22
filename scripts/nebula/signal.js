define('nebula/signal', function() {
    /*
     * Simple signal dispatcher implementation.
     */
    'use strict';


    function connect() {
        var kwargs = typeof arguments[0] === 'function' ? {'receiver': arguments[0]} : arguments[0];
        if (typeof kwargs.receiver !== 'function')
            throw new Error("can't connect receiver to a signal, receiver is not a function");
        for (var i = 0; i < this.receivers.length; i++)
            if (this.receivers[i].receiver === kwargs.receiver)
                return;
        this.receivers.push({
            'receiver': kwargs.receiver,
            'sender': kwargs.sender,
            // Context can't be undefined, must be at least null, otherwise webkit disables some
            // performance optimizations.
            'context': kwargs.context || null});
    }

    function disconnect() {
        // Given receiver will not be notified about this signal sending anymore.
        var receiver = typeof arguments[0] === 'function' ? arguments[0] : arguments[0].receiver;
        for (var i = 0; i < this.receivers.length; i++)
            if (this.receivers[i].receiver === receiver) {
                this.receivers.splice(i, 1);
                return;
            }
    }

    function send(sender) {
        // Execute all connected receivers, forwarding all arguments.
        for (var i = 0; i < this.receivers.length; i++) {
            var entry = this.receivers[i];
            if (typeof entry.sender === 'undefined' || entry.sender === sender)
                entry.receiver.apply(entry.context, arguments);
        }
    }

    function Signal() {
        /*
         * This is constructor that should be called with the `new` operator, but it returns a function with
         * attributes and methods. In this way signal instances can be called directly, i.e. they can be used as
         * a function.
         */
        function signal() {
            connect.apply(signal, arguments);
        }
        signal.receivers = [];
        signal.connect = connect.bind(signal);
        signal.disconnect = disconnect.bind(signal);
        signal.send = send.bind(signal);
        return signal;
    }


    return Signal;
});
