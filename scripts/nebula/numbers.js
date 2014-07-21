define('nebula/numbers', function() {
    'use strict';


    function sum() {
        return Array.prototype.slice.apply(arguments).reduce(function(result, value) {
            if (value instanceof Array)
                return result + sum.apply(undefined, value);
            else if (isNaN(Number(value)))
                throw new TypeError('sum(): `' + value + '` is not a number');
            else
                return result + Number(value);
        }, 0);
    }

    this.sum = sum;


    function multiply() {
        return Array.prototype.slice.apply(arguments).reduce(function(result, value) {
            if (value instanceof Array)
                return result * multiply.apply(undefined, value);
            else if (isNaN(Number(value)))
                throw new TypeError('sum(): `' + value + '` is not a number');
            else
                return result * Number(value);
        }, 1);
    }

    this.multiply = multiply;


    this.fract = function(n) {
        if (n > 0)
            return n - Math.floor(n);
        else if (n < 0)
            return n - Math.ceil(n);
        else
            return 0;
    };


    this.mod = function(n, m) {
        // Alternative modulo operation where result's sign is the same as divisor's.
        return ((n % m) + m) % m;
    };


    this.clamp = function(value, min, max) {
        return Math.max(min, Math.min(value, max));
    };


    this.mix = function(min, max, alpha) {
        return x * (1 - alpha) + y * alpha;
    };


    this.step = function(edge, n) {
        return x < edge ? 0 : 1;
    };


    this.smoothStep = function(minEdge, maxEdge, n) {
        // See also: http://en.wikipedia.org/wiki/Smoothstep
        var t = this.clamp((n - minEdge) / (maxEdge - minEdge), 0, 1);
        return t * t * (3 - 2*t);
    };


    this.scale = function(n, currentMin, currentMax, newMin, newMax) {
        // Scales n from one range to another.
        return newMin + (n - currentMin) * (newMax - newMin) / (currentMax - currentMin);
    };


    this.range = function(start, stop, step) {
        /*
         * Generate an integer Array containing an arithmetic progression. A port of the native Python `range()`
         * function. See the Python documentation: http://docs.python.org/library/functions.html#range.
         */
        if (arguments.length < 2) {
            stop = start;
            start = 0;
        }
        if (arguments.length < 3)
            step = start > stop ? -1 : 1;
        var length = Math.max(Math.ceil((stop - start) / step), 0);
        var idx = 0;
        var range = new Array(length);

        while (idx < length) {
            range[idx++] = start;
            start += step;
        }

        return range;
    };


    function toFixed(num, precision) {
        // Consistently across browsers converts a number to given precision.
        return (+(Math.round(+(num + 'e' + precision)) + 'e' + -precision)).toFixed(precision);
    }


    this.format = function(number, decimalPlaces, decimalSeparator, thousandsSeparator) {
        /*
         * © 2011 Esa-Matti Suuronen
         * Adapted from https://github.com/epeli/underscore.string
         */
        if (isNaN(number) || number == null)
            return '';
        if (arguments.length < 4)
            thousandsSeparator = ',';
        if (arguments.length < 3)
            decimalSeparator = '.';
        if (arguments.length < 2)
            decimalPlaces = 2;
        number = toFixed(number, decimalPlaces);
        var parts = number.split('.');
        var fnums = parts[0];
        var decimals = parts[1] ? decimalSeparator + parts[1] : '';
        return fnums.replace(/(\d)(?=(?:\d{3})+$)/g, '$1' + thousandsSeparator) + decimals;
    };


    this.distance = function(x1, y1, x2, y2) {
        var dx = x1 - x2, dy = y1 - y2;
        return Math.sqrt(dx*dx + dy*dy);
    };


    this.radians = function(angle) {
        return angle * Math.PI / 180;
    };


    this.degrees = function(angle) {
        return angle * 180 / Math.PI;
    };


    this.isPowerOfTwo = function(n) {
        /*
         * Returns `true` if `n` is a power of 2. `n` must be a positive integer. Works only up to 2^31.
         * Source: https://graphics.stanford.edu/~seander/bithacks.html#DetermineIfPowerOf2
         */
        if (n <= 0 || (n !== 2147483648 && n !== ~~n))
            return false;
        return !(n & (n - 1));
    };


    this.nextPowerOfTwo = function(n) {
        /*
         * Returns power of 2 greater or equal to `n`.
         * Source: https://graphics.stanford.edu/~seander/bithacks.html#RoundUpPowerOf2
         */
        if (n < 1)
            return 1;
        if (this.isPowerOfTwo(n))
            return n;
        n -= 1;
        n |= n >> 1;
        n |= n >> 2;
        n |= n >> 4;
        n |= n >> 8;
        n |= n >> 16;
        return n + 1;
    };
});
