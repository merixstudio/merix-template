define('nebula/colors/hls', ['nebula/numbers'], function(numbers) {
    /*
     * HLS: Hue, Luminance, Saturation
     * H: position in the spectrum
     * L: color lightness
     * S: color saturation
     *
     * All inputs and outputs are numbers in range [0.0...1.0]. Inputs outside the valid range may cause exceptions
     * or invalid outputs.
     *
     * References:
     * http://en.wikipedia.org/wiki/HLS_color_space
     *
     * Adapted from http://hg.python.org/cpython/file/493d1ae3227b/Lib/colorsys.py
     * Copyright (c) 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013
     * Python Software Foundation; All Rights Reserved
     */
    'use strict';


    function toString() {
        return '[HLS h:' + this.h + ' l:' + this.l + ' s:' + this.s + ']';
    }


    function create(h, l, s) {
        return {'h': h || 0, 'l': l || 0, 's': s || 0, 'toString': toString};
    }


    function copy(color) {
        return create(color.h, color.l, color.s);
    }


    function _v(m1, m2, hue) {
        hue = numbers.mod(hue, 1);
        if (hue < 1/6)
            return m1 + (m2-m1)*hue*6;
        if (hue < 3/6)
            return m2;
        if (hue < 4/6)
            return m1 + (m2-m1)*(2/3-hue)*6;
        return m1;
    }


    function toRGB(color, out) {
        var h = color.h, l = color.l, s = color.s, m1, m2;
        if (s === 0) {
            out.r = out.g = out.b = l;
            return;
        }
        m2 = l <= 0.5 ? l*(1+s) : l+s-(l*s);
        m1 = 2*l - m2;
        out.r = _v(m1, m2, h+1/3);
        out.g = _v(m1, m2, h);
        out.b = _v(m1, m2, h-1/3);
    }


    return define.functions(create, copy, toRGB);
});
