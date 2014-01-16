
module('signal.js');

test('A receiver functions can be connected', function() {
    var Signal = require('nebula/signal');
    var testSignal = new Signal();
    var someFunc1 = function() {};
    var someFunc2 = function() {};
    var someFunc3 = function() {};

    testSignal.connect(someFunc1);
    testSignal.connect(someFunc2);
    testSignal.connect(someFunc3);

    strictEqual(testSignal.receivers[0], someFunc1);
    strictEqual(testSignal.receivers[1], someFunc2);
    strictEqual(testSignal.receivers[2], someFunc3);
});

test('Connecting same receiver second time does nothing', function() {
    var Signal = require('nebula/signal');
    var testSignal = new Signal();
    var someFunc = function() {};

    testSignal.connect(someFunc);
    testSignal.connect(someFunc);

    strictEqual(testSignal.receivers.length, 1);
});

test('Connecting non-function throws', function() {
    var Signal = require('nebula/signal');
    var testSignal = new Signal();

    throws(testSignal.connect.bind(testSignal, [{}]), Error);
});

test('A receiver can be disconnected', function() {
    var Signal = require('nebula/signal');
    var testSignal = new Signal();
    var someFunc = function() {};

    testSignal.connect(someFunc);
    testSignal.disconnect(someFunc);
    strictEqual(testSignal.receivers.length, 0);
});

test('Disconnecting unknown receiver does nothing', function() {
    var Signal = require('nebula/signal');
    var testSignal = new Signal();
    var receiverFunc = function() {};
    var unknownFunc = function() {};

    testSignal.connect(receiverFunc);
    testSignal.disconnect(unknownFunc);
    deepEqual(testSignal.receivers, [receiverFunc]);
});

test('Sending a empty signal does nothing', function() {
    var Signal = require('nebula/signal');
    var testSignal = new Signal();
    testSignal.send();
    ok(true, 'No exception raised');
});

test('Sending a signal executes all receivers', function() {
    var Signal = require('nebula/signal');
    var testSignal = new Signal();
    var someFunc1 = this.spy();
    var someFunc2 = this.spy();
    var someFunc3 = this.spy();

    testSignal.connect(someFunc1);
    testSignal.connect(someFunc2);
    testSignal.connect(someFunc3);
    testSignal.send();

    ok(someFunc1.calledOnce);
    ok(someFunc2.calledOnce);
    ok(someFunc3.calledOnce);
});

test('Sending a signal with arguments', function() {
    var Signal = require('nebula/signal');
    var testSignal = new Signal();
    var someFunc = this.spy();
    var message = "I'm very important message to deliver";

    testSignal.connect(someFunc);
    testSignal.send(message);

    ok(someFunc.calledWith(message));
});
