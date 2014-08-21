define('nebula/colors/hsv', ['nebula/numbers'], function(numbers) {
    /*
     * HSV: Hue, Saturation, Value
     * H: position in the spectrum
     * S: color saturation ("purity")
     * V: color brightness
     *
     * All inputs and outputs are numbers in range [0.0...1.0]. Inputs outside the valid range may cause exceptions
     * or invalid outputs.
     *
     * References:
     * http://en.wikipedia.org/wiki/HSV_color_space
     *
     * Adapted from http://hg.python.org/cpython/file/493d1ae3227b/Lib/colorsys.py
     * Copyright (c) 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013
     * Python Software Foundation; All Rights Reserved
     */
    'use strict';


    function toString() {
        return '[HSV h:' + this.h + ' s:' + this.s + ' v:' + this.v + ']';
    }


    function create(h, s, v) {
        return {'h': h || 0, 's': s || 0, 'v': v || 0, 'toString': toString};
    }


    function copy(color) {
        return create(color.h, color.s, color.v);
    }


    function toRGB(color, out) {
        var h = color.h, s = color.s, v = color.v;
        if (s === 0) {
            out.r = out.g = out.b = v;
            return;
        }
        var i = Math.floor(h*6);
        var f = h*6 - i;
        var p = v * (1 - s);
        var q = v * (1 - s*f);
        var t = v * (1 - s*(1-f));
        i = numbers.mod(i, 6);
        if (i === 0) {
            out.r = v;
            out.g = t;
            out.b = p;
        } else if (i === 1) {
            out.r = q;
            out.g = v;
            out.b = p;
        } else if (i === 2) {
            out.r = p;
            out.g = v;
            out.b = t;
        } else if (i === 3) {
            out.r = p;
            out.g = q;
            out.b = v;
        } else if (i === 4) {
            out.r = t;
            out.g = p;
            out.b = v;
        } else {
            out.r = v;
            out.g = p;
            out.b = q;
        }
    }


    return define.functions(create, copy, toRGB);
});
