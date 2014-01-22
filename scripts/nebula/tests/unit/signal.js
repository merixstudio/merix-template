describe('signal.js', function() {
    var Signal = require('nebula/signal');

    describe('`Signal.connect()`', function() {
        it('allows to create a signal and connect receivers', function() {
            var testSignal = new Signal();
            var someFunc1 = function() {};
            var someFunc2 = function() {};
            var someFunc3 = function() {};

            testSignal.connect(someFunc1);
            testSignal.connect(someFunc2);
            testSignal.connect(someFunc3);

            expect(testSignal.receivers[0]).toBe(someFunc1);
            expect(testSignal.receivers[1]).toBe(someFunc2);
            expect(testSignal.receivers[2]).toBe(someFunc3);
        });

        it("doesn't connect a receiver if already connected", function() {
            var testSignal = new Signal();
            var someFunc = function() {};

            testSignal.connect(someFunc);
            testSignal.connect(someFunc);

            expect(testSignal.receivers.length).toBe(1);
        });

        it("allows only functions to be receivers", function() {
            var testSignal = new Signal();
            expect(testSignal.connect.bind(testSignal, {})).toThrow();
        });
    });

    describe('`Signal.disconnect()`', function() {
        it('allows to disconnect a receiver', function() {
            var testSignal = new Signal();
            var someFunc = function() {};

            testSignal.connect(someFunc);
            testSignal.disconnect(someFunc);
            expect(testSignal.receivers.length).toBe(0);
        });

        it('ignores unknown receivers when disconnecting', function() {
            var testSignal = new Signal();
            var receiverFunc = function() {};
            var unknownFunc = function() {};

            testSignal.connect(receiverFunc);
            testSignal.disconnect(unknownFunc);
            expect(testSignal.receivers[0]).toBe(receiverFunc);
        });
    });

    describe('`Signal.send()`', function() {
        it('calls all receivers when given signal is sent', function() {
            var testSignal = new Signal();
            var someFunc1 = jasmine.createSpy();
            var someFunc2 = jasmine.createSpy();
            var someFunc3 = jasmine.createSpy();

            testSignal.connect(someFunc1);
            testSignal.connect(someFunc2);
            testSignal.connect(someFunc3);
            testSignal.send();

            expect(someFunc1).toHaveBeenCalled();
            expect(someFunc2).toHaveBeenCalled();
            expect(someFunc3).toHaveBeenCalled();
        });

        it('forwards all arguments to receivers when sent', function() {
            var testSignal = new Signal();
            var someFunc = jasmine.createSpy();
            var message = "I'm a very important message";

            testSignal.connect(someFunc);
            testSignal.send(message);

            expect(someFunc).toHaveBeenCalledWith(message);
        });
    });
});
