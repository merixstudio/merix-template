define('nebula/format', function() {
    /*
     * Copyright (c) 2009 Borgar Þorsteinsson, http://borgar.net/
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
     * documentation files (the "Software"), to deal in the Software without restriction, including without limitation
     * the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,
     * and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in all copies or substantial portions
     * of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
     * TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
     * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
     * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
     * DEALINGS IN THE SOFTWARE.
     *
     *
     * Provides a full implementation of Python style string formatting for JavaScript as outlined in the Python
     * documentation: http://docs.python.org/library/stdtypes.html#string-formatting-operations
     * Source: https://github.com/borgar/String.format
     */
    'use strict';


    function _int(n) {
        return parseInt(n, 10);
    }

    function _float(n) {
        return parseFloat(n, 10);
    }

    function _has(s, c) {
        return !!s && s.indexOf(c) !== -1;
    }


    // fixme: this should report array if object is an arguments list (or jQuery?)
    function getType(o) {
        var t = typeof o;
        if (t === 'object') {
            if (o.callee)
                return 'array';
            t = /^\[object\s(.+?)\]$/.test(Object.prototype.toString.call(o)) && RegExp.$1.toLowerCase();
        }
        return t;
    }


    // padding functions
    function getPadding(val, wid, chr) {
        val = val + '';
        var d = Math.abs(wid) - val.length;
        return (d > 0) ? Array(d + 1).join(chr || ' ') : '';
    }

    function pad(str, wid, p) {
        p = (wid != null) ? getPadding(str, wid, p) : '';
        return (wid < 0) ? str + p : p + str;
    }


    function repr(v) {
        var r=[], i=0;
        switch (getType(v)) {
            case 'array':
                for (; i < v.length; i++)
                    r.push(repr(v[i]) );
                return '[' + r.join(', ') + ']';
            case 'object':
                // the ordering is simply for predictable (debuggable) output
                var l = [];
                for (i in v)
                    l.push( i );
                l.sort();
                for (i = 0; i < l.length; i++)
                    r.push("'" + l[i] + "': " + repr(v[l[i]]));
                return '{' + r.join(', ') + '}';
            case 'string':
                return "'" + v.replace(/'/g, "\\'") + "'";
            case 'function':
                return '(' + m.toSource() + ')';
        }
        return String(v);
    }


    function sign(n, force, space) {
        return n < 0 && '-' || force && '+' || space && ' ' || '';
    }


    var convert = {
        // Signed integer decimal.
        'd': function(v, o) {
            var i = _int(v);
            var n = Math.abs(i);
            var s = sign(i, o.sign, o.space);
            var w = o.pad == '0' ? Math.max(!!o.precision, (o.minwidth || 0) - s.length) : o.precision;
            return pad(s + getPadding(n, w, '0') + n, o.minwidth, o.pad);
        },

        // Unsigned octal value.
        'o': function(v, o) {
            // The alternate form causes a leading zero ('0') to be
            // inserted between left-hand padding and the formatting
            // of the number if the leading character of the result
            // is not already a zero.
            var i = _int(v);
            var n = Math.abs(i).toString(8);
            var s = sign(i, o.sign, o.space);
            var a = o.alt ? '0' : '';
            var w = o.pad == '0' ? Math.max(!!o.precision, (o.minwidth || 0) - s.length - a.length) : o.precision;
            var p = getPadding(n, w, '0');
            if (p.charAt(0) === '0' || n.charAt(0) === '0')
                a = '';
            return pad(s + a + p + n, o.minwidth, o.pad);
        },

        // Signed hexadecimal (lowercase).
        'x': function(v, o) {
            // The alternate form causes a leading '0x' to be inserted between
            // left-hand padding and the formatting of the number if the leading
            // character of the result is not already a zero.
            var i = _int(v);
            var n = Math.abs(i).toString(16);
            var s = sign(i, o.sign, o.space);
            var a = o.alt ? '0x' : '';
            var w = o.pad == '0' ? Math.max(!!o.precision, (o.minwidth || 0) - s.length - a.length) : o.precision;
            return pad(s + a + getPadding(n, w, '0') + n, o.minwidth, o.pad);
        },

        // Floating point exponential format (lowercase).
        'e': function(v, o) {
            // The alternate form causes the result to always contain a
            // decimal point, even if no digits follow it.
            // The precision determines the number of digits after the
            // decimal point and defaults to 6.
            var i = _float(v);
            var p = o.precision == null ? 6 : o.precision;
            var n = Math.abs(i).toExponential(p).split('e+');
            var s = sign(i, o.sign, o.space);
            n = n[0] + (!p && o.alt && '.' || '') + 'e+' + pad(n[1], 2, '0');
            return s + pad(n, o.minwidth - s.length, o.pad);
        },

        // Floating point decimal format.
        'f': function(v, o) {
            // The alternate form causes the result to always contain a
            // decimal point, even if no digits follow it.
            // The precision determines the number of digits after the
            // decimal point and defaults to 6.
            var i = _float(v);
            // Python: For safety reasons, floating point precisions are clipped to 50;
            // BT: shouldn't cause problems in JS as numbers don't reach that far.
            var p = o.precision == null ? 6 : Math.min(Math.abs(o.precision), 50);

            // %f conversions for numbers whose absolute value is over 1e+25 are
            // replaced by %g conversions. All other errors raise exceptions.
            if (v > 1e+25)
                // FIXME: ECMA standard (& browsers) tops at 1e+21 - what to do?
                return convert.g(v, o);
            var n = Math.abs(i).toFixed(p);
            var s = sign(i, o.sign, o.space);
            var d = (o.alt && p == 0) ? '.' : '';
            var w = o.minwidth > 0 ? o.minwidth - s.length : o.minwidth + s.length;
            return s + pad(n + d, w, o.pad);
        },

        // General format. Uses lowercase exponential format if
        // exponent is less than -4 or not less than precision,
        // decimal format otherwise.
        'g': function(v, o) {
            // The alternate form causes the result to always contain a decimal point,
            // and trailing zeroes are not removed as they would otherwise be.
            // The precision determines the number of significant digits before and
            // after the decimal point and defaults to 6.
            var i = _float(v);
            var p = o.precision == null ? 5 : o.precision;
            if (Math.abs(i) >= Math.pow(10, p || 1))
                // exponential format
                return convert.e( v, o );
            // see: floating point comments
            var n;
            if (o.alt) {
                var a = Math.abs(i).toFixed(p).split('.');
                n = a[0] + '.' + (a[1] || '');
            } else
                n = o.precision != null ? Math.abs(i).toPrecision(p).replace(/\.?0+$/, '') : Math.abs(i) + '';
            var s = sign(i, o.sign, o.space);
            var w = o.minwidth > 0 ? o.minwidth - s.length : o.minwidth + s.length;
            return s + pad(n, w, o.pad);
        },

        // Single character (accepts integer or single character string).
        'c': function(v, o) {
            var t = getType(v);
            if (t === 'number')
                return String.fromCharCode(v);
            if (t === 'string')
                return v.charAt(0);
            throw new TypeError('%c requires number or string');
        },

        // String (converts any python object using repr()).
        'r': function(v, o) {
            // The precision determines the maximal number of characters used.
            var s = repr( v );
            var p = o.precision == null ? s.length : o.precision;
            return pad(s.substring(0, p), o.minwidth, ' ');
        },

        // String (converts any python object using str()).
        's': function(v, o) {
            // If the object or format provided is a unicode string, the
            // resulting string will also be unicode.
            // The precision determines the maximal number of characters used.
            var s = '' + v;
            var p = o.precision == null ? s.length : o.precision;
            return pad(s.substring(0, p), o.minwidth, ' ');
        },

        // No argument is converted, results in a '%' character in the result.
        '%': function(v, o) {
            return '%';
        }
    };

    convert.i = convert.u = convert.d;


    // Python seems also to have p and z?
    var CHUNKER = /^%(?:\(([^)]*?)\))?([ 0#+\-]+)?(\d+|\*)?(\.\d*|\*)?([hlL])?([diouxefgcrs%])/i;

    function format(subject, args) {
        // subject may be a string and nothing else
        subject = String(subject);

        // sugar: if args is a single string, turn it into an array
        args = getType(args) !== 'array' ? [args] : args;
        // sugar: if args is an array in array - we'll peel the outer one off
        args = (args.length == 1 && getType(args[0]) == 'array') ? args[0] : args;

        var res = '';
        var a = 0;
        for (var i = 0; i < subject.length; i++) {
            var chr = subject.charAt(i);
            if (chr != '%') {
                res += chr;
                continue;
            }

            var m = CHUNKER.exec(subject.substr(i));
            // m: 0 full-match, 1 key, 2 flags, 3 min, 4 prec, 5 len, 6 type
            if (!m)
                // invalid or unrecognized % format
                // return the rest of the string untouched as we don't know what remains in args...
                return res + subject.substr(i);

            // the value to convert
            var value = m[1] ? args[0][m[1]] : args[a];
            var o = {
                'type': m[6].toLowerCase(),
                'alt': _has(m[2], '#'),
                'padleft': _has( m[2], '-'),
                'space': _has(m[2], ' '),
                'sign': _has(m[2], '+'),
                'pad': _has(m[2], '0') && !_has(m[2], '-') ? '0' : ' ',
                'lenmod': m[5] ? _int(m[5]) : ''
            };

            // move to next item in args if not working by key lookup or printing a %
            a += (m[1] || m[6] === '%') ? 0 : 1;

            // -- Minimum field width (optional). --
            // If specified as an "*" (asterisk), the actual width is read from the next
            // element of the tuple in values, and the object to convert comes after the
            // minimum field width and optional precision.
            if (m[3] == '*') {
                if (m[1])
                    throw new SyntaxError('* expects a number');
                o.minwidth = args[a++];
            } else if (m[3])
                o.minwidth = _int(m[3]);

            if (o.minwidth && _has(m[2], '-'))
                o.minwidth = -o.minwidth;

            // -- Precision (optional). --
            // If specified as "*" (an asterisk), the actual width is read from the next
            // element of the tuple in values, and the value to convert comes after the
            // precision.
            if (m[4] == '*') {
                if (m[1])
                    throw new SyntaxError('* expects a number');
                o.precision = args[a++];
            } else if (m[4])
                o.precision = _int(m[4].substr(1)) || 0;

            // conversion function
            var fn = convert[o.type] || convert.s;
            // do the conversion and append it to the result string
            var r = fn(value, o);
            // if type was uppercase to begin with, then result should be
            res += m[6] !== o.type ? r.toUpperCase() : r;
            i += m[0].length - 1;
            // FIXME: if we're out of characters then we need to throw exception
        }
        return res;
    }


    return format;
});
