/*
 * Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
 */
if (!Array.prototype.indexOf)
    Array.prototype.indexOf = function(searchElement, fromIndex) {
        if (this === undefined || this === null)
            throw new TypeError('"this" is null or not defined');

        var length = this.length >>> 0;  // Hack to convert object.length to a UInt32
        fromIndex = +fromIndex || 0;

        if (Math.abs(fromIndex) === Infinity)
            fromIndex = 0;

        if (fromIndex < 0) {
            fromIndex += length;
            if (fromIndex < 0)
                fromIndex = 0;
        }

        for (; fromIndex < length; fromIndex++)
            if (this[fromIndex] === searchElement)
                return fromIndex;
        return -1;
    };


/*
 * Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
 */
if (!Function.prototype.bind)
    Function.prototype.bind = function(oThis) {
        if (typeof this !== "function")
            // closest thing possible to the ECMAScript 5 internal IsCallable function
            throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");

        var aArgs = Array.prototype.slice.call(arguments, 1), fToBind = this, fNOP = function() {};
        var fBound = function() {
            return fToBind.apply(this instanceof fNOP && oThis ? this : oThis,
                                 aArgs.concat(Array.prototype.slice.call(arguments)));
        };

        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();
        return fBound;
    };

/*
 * Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create
 */
if (!Object.create)
    Object.create = (function() {
        function F(){}
        return function(o) {
            if (arguments.length != 1)
                throw new Error('Object.create implementation only accepts one parameter.');
            F.prototype = o;
            return new F();
        };
    })();


// Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
if ('function' !== typeof Array.prototype.reduce) {
    Array.prototype.reduce = function(callback /*, initialValue*/) {
        'use strict';
        if (null === this || 'undefined' === typeof this)
            throw new TypeError('Array.prototype.reduce called on null or undefined');

        if ('function' !== typeof callback)
            throw new TypeError( callback + ' is not a function' );

        var t = Object(this), len = t.length >>> 0, k = 0, value;

        if (arguments.length >= 2)
            value = arguments[1];
        else {
            while (k < len && ! k in t) k++;

            if (k >= len)
                throw new TypeError('Reduce of empty array with no initial value');

            value = t[k++];
        }

        for (; k < len; k++)
            if (k in t)
                value = callback(value, t[k], k, t);

        return value;
    };
}
