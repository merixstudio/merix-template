define('nebula/number', function() {
    'use strict';


    function mod(n, m) {
        // Alternative modulo operation where result's sign is the same divisor.
        return ((n % m) + m) % m;
    }


    function clamp(min, value, max) {
        return Math.max(min, Math.min(value, max));
    }


    function scale(n, currentMin, currentMax, newMin, newMax) {
        // Scales n from one range to another.
        return newMin + (n - currentMin) * (newMax - newMin) / (currentMax - currentMin);
    }


    function range(start, stop, step) {
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
    }


    return {
        'mod': mod,
        'clamp': clamp,
        'scale': scale,
        'range': range
    };
});
