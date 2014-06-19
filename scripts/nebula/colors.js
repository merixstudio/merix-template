define('nebula/colors', ['nebula/number'], function(number) {
    /*
     * Conversion functions between RGB and other color systems.
     *
     * This modules provides two functions for each color system ABC:
     *
     *   rgb2abc(r, g, b) --> a, b, c
     *   abc2rgb(a, b, c) --> r, g, b
     *
     * All inputs and outputs are triples of floats in the range [0.0...1.0] (with the exception of I and Q, which
     * covers a slightly larger range). Inputs outside the valid range may cause exceptions or invalid outputs.
     *
     * Supported color systems:
     * RGB: Red, Green, Blue components
     * YIQ: Luminance, Chrominance (used by composite video signals)
     * HLS: Hue, Luminance, Saturation
     * HSV: Hue, Saturation, Value
     *
     * References:
     * http://en.wikipedia.org/wiki/YIQ
     * http://en.wikipedia.org/wiki/HLS_color_space
     * http://en.wikipedia.org/wiki/HSV_color_space
     *
     * Copyright (c) 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013
     * Python Software Foundation; All Rights Reserved
     *
     * Adapted from http://hg.python.org/cpython/file/493d1ae3227b/Lib/colorsys.py
     */
    'use strict';


    /*
     * YIQ: used by composite video signals (linear combinations of RGB)
     * Y: perceived grey level (0.0 == black, 1.0 == white)
     * I, Q: color components
     *
     * There are a great many versions of the constants used in these formulae. The ones in this library uses
     * constants from the FCC version of NTSC.
     */
    function rgb2yiq(r, g, b) {
        var y = 0.30*r + 0.59*g + 0.11*b;
        var i = 0.74*(r-y) - 0.27*(b-y);
        var q = 0.48*(r-y) + 0.41*(b-y);
        return {'y': y, 'i': i, 'q': q};
    }

    function yiq2rgb(y, i, q) {
        var r, g, b;
        r = y + 0.9468822170900693*i + 0.6235565819861433*q;
        g = y - 0.27478764629897834*i - 0.6356910791873801*q;
        b = y - 1.1085450346420322*i + 1.7090069284064666*q;
        r = r > 1 ? 1 : (r < 0 ? 0 : r);
        g = g > 1 ? 1 : (g < 0 ? 0 : g);
        b = b > 1 ? 1 : (b < 0 ? 0 : b);
        return {'r': r, 'g': g, 'b': b};
    }


    /*
     * HLS: Hue, Luminance, Saturation
     * H: position in the spectrum
     * L: color lightness
     * S: color saturation
     */
    function rgb2hls(r, g, b) {
        var maxc = Math.max(r, g, b);
        var minc = Math.min(r, g, b);
        var h, l = (minc + maxc) / 2, s, dc = maxc - minc, rc, gc, bc;
        if (minc === maxc)
            return {'h': 0, 'l': l, 's': 0.0};
        s = l <= 0.5 ? dc/(maxc+minc) : dc/(2-maxc-minc);
        rc = (maxc-r) / dc;
        gc = (maxc-g) / dc;
        bc = (maxc-b) / dc;
        if (r === maxc)
            h = bc-gc;
        else if (g === maxc)
            h = 2+rc-bc;
        else
            h = 4+gc-rc;
        return {'h': number.mod(h/6, 1), 'l': l, 's': s};
    }

    function _v(m1, m2, hue) {
        hue = number.mod(hue, 1);
        if (hue < 1/6)
            return m1 + (m2-m1)*hue*6;
        if (hue < 3/6)
            return m2;
        if (hue < 4/6)
            return m1 + (m2-m1)*(2/3-hue)*6;
        return m1;
    }

    function hls2rgb(h, l, s) {
        var m1, m2;
        if (s === 0)
            return {'r': l, 'g': l, 'b': l};
        m2 = l <= 0.5 ? l*(1+s) : l+s-(l*s);
        m1 = 2*l - m2;
        return {'r': _v(m1, m2, h+1/3), 'g': _v(m1, m2, h), 'b': _v(m1, m2, h-1/3)};
    }


    /*
     * HSV: Hue, Saturation, Value
     * H: position in the spectrum
     * S: color saturation ("purity")
     * V: color brightness
     */
    function rgb2hsv(r, g, b) {
        var maxc = Math.max(r, g, b);
        var minc = Math.min(r, g, b);
        var h, s, v = maxc, rc, gc, bc, dc = maxc - minc;
        if (minc === maxc)
            return {'h': 0, 's': 0, 'v': v};
        s = dc / maxc;
        rc = (maxc-r) / dc;
        gc = (maxc-g) / dc;
        bc = (maxc-b) / dc;
        if (r === maxc)
            h = bc-gc;
        else if (g === maxc)
            h = 2+rc-bc;
        else
            h = 4+gc-rc;
        return {'h': number.mod(h/6, 1), 's': s, 'v': v};
    }

    function hsv2rgb(h, s, v) {
        if (s === 0)
            return {'r': v, 'g': v, 'b': v};
        var i = Math.floor(h*6);
        var f = h*6 - i;
        var p = v * (1 - s);
        var q = v * (1 - s*f);
        var t = v * (1 - s*(1-f));
        i = number.mod(i, 6);
        if (i === 0)
            return {'r': v, 'g': t, 'b': p};
        if (i === 1)
            return {'r': q, 'g': v, 'b': p};
        if (i === 2)
            return {'r': p, 'g': v, 'b': t};
        if (i === 3)
            return {'r': p, 'g': q, 'b': v};
        if (i === 4)
            return {'r': t, 'g': p, 'b': v};
        if (i === 5)
            return {'r': v, 'g': p, 'b': q};
        // Cannot get here
    }


    return {
        'rgb2yiq': rgb2yiq,
        'yiq2rgb': yiq2rgb,
        'rgb2hls': rgb2hls,
        'hls2rgb': hls2rgb,
        'rgb2hsv': rgb2hsv,
        'hsv2rgb': hsv2rgb
    };
});
