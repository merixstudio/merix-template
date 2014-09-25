describe('signal.js', function() {
    var Signal = require('nebula/signal');

    describe('`Signal.connect()`', function() {
        it('allows to create a signal and connect receivers', function() {
            var testSignal = new Signal();
            var testSignalEmpty = new Signal();
            var someFunc1 = function() {};
            var someFunc2 = function() {};
            var someFunc3 = function() {};

            testSignal(someFunc1);
            testSignal(someFunc2);
            testSignal(someFunc3);

            expect(testSignalEmpty.receivers.length).toBe(0);
            expect(testSignal.receivers[0].receiver).toBe(someFunc1);
            expect(testSignal.receivers[1].receiver).toBe(someFunc2);
            expect(testSignal.receivers[2].receiver).toBe(someFunc3);
        });

        it("doesn't connect a receiver if there is a receiver with specified context and sender already connected", function() {
            var testSignal = new Signal();
            var someFunc = function() {};
            var sender = {};
            var context = {};
            var kwargs = {'receiver': someFunc, 'sender': sender, 'context': context};

            testSignal(someFunc);
            testSignal(kwargs);

            expect(testSignal.bind(testSignal, kwargs)).toThrow();
            expect(testSignal.connect.bind(testSignal, kwargs)).toThrow();

            expect(testSignal.bind(testSignal, someFunc)).toThrow();
            expect(testSignal.connect.bind(testSignal, someFunc)).toThrow();
        });

        it("allows only functions to be receivers", function() {
            var testSignal = new Signal();
            expect(testSignal.bind(testSignal, {})).toThrow();
            expect(testSignal.connect.bind(testSignal, {})).toThrow();
        });
    });

    describe('`Signal.disconnect()`', function() {
        it('allows to disconnect a receiver', function() {
            var testSignal = new Signal();
            var someFunc = function() {};

            testSignal(someFunc);
            testSignal.disconnect(someFunc);
            expect(testSignal.receivers.length).toBe(0);
        });

        it('ignores unknown receivers when disconnecting', function() {
            var testSignal = new Signal();
            var receiverFunc = function() {};
            var unknownFunc = function() {};

            testSignal(receiverFunc);
            testSignal.disconnect(unknownFunc);
            expect(testSignal.receivers[0].receiver).toBe(receiverFunc);
        });
    });

    describe('`Signal.send()`', function() {
        it('calls all receivers when given signal is sent', function() {
            var testSignal = new Signal();
            var someFunc1 = jasmine.createSpy();
            var someFunc2 = jasmine.createSpy();
            var someFunc3 = jasmine.createSpy();

            testSignal(someFunc1);
            testSignal(someFunc2);
            testSignal(someFunc3);
            testSignal.send();

            expect(someFunc1).toHaveBeenCalled();
            expect(someFunc2).toHaveBeenCalled();
            expect(someFunc3).toHaveBeenCalled();
        });

        it('forwards all arguments to receivers when sent', function() {
            var testSignal = new Signal();
            var someFunc = jasmine.createSpy();
            var message = "I'm a very important message";

            testSignal(someFunc);
            testSignal.send(message);

            expect(someFunc).toHaveBeenCalledWith(message);
        });

        it("calls only receivers, whose sender matches or receivers without a sender", function() {
            var testSignal = new Signal();
            var sender = 'Barney & Betty';
            var receiverA = {'receiver': jasmine.createSpy(), 'sender': sender};
            var receiverB = {'receiver': jasmine.createSpy(), 'sender': 'Fred & Wilma'};
            var receiverNoSender = {'receiver': jasmine.createSpy()};
            testSignal(receiverA);
            testSignal(receiverB);
            testSignal(receiverNoSender);
            testSignal.send(sender);
            expect(receiverA.receiver).toHaveBeenCalledWith(sender);
            expect(receiverB.receiver).not.toHaveBeenCalled();
            expect(receiverNoSender.receiver).toHaveBeenCalledWith(sender);
        });

        it("calls receivers with correct context", function() {
            var testSignal = new Signal();
            var context = {};
            var receiver = {'receiver': jasmine.createSpy(), 'context': context};
            testSignal(receiver);
            testSignal.send();
            expect(receiver.receiver).toHaveBeenCalled();
            expect(receiver.receiver.calls.mostRecent()).toEqual({'object': context, 'args': []});
        });
    });
});
