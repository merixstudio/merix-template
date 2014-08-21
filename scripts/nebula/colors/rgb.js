define('nebula/colors/rgb', ['nebula/numbers'], function(numbers) {
    /*
     * Conversion functions between RGB and other color systems.
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


    function toString() {
        return '[RGB r:' + this.r + ' g:' + this.g + ' b:' + this.b + ']';
    }


    function valueOf() {
        return pack(this);
    }


    function create(r, g, b) {
        return {'r': r || 0, 'g': g || 0, 'b': b || 0, 'toString': toString, 'valueOf': valueOf};
    }


    function copy(color) {
        return create(color.r, color.g, color.b);
    }


    function toYIQ(color, out) {
        /*
         * YIQ: used by composite video signals (linear combinations of RGB)
         * Y: perceived grey level (0.0 == black, 1.0 == white)
         * I, Q: color components
         *
         * There are a great many versions of the constants used in these formulae. The ones in this library uses
         * constants from the FCC version of NTSC.
         */
        var r = color.r, g = color.g, b = color.b;
        out.y = 0.30*r + 0.59*g + 0.11*b;
        out.i = 0.74*(r-out.y) - 0.27*(b-out.y);
        out.q = 0.48*(r-out.y) + 0.41*(b-out.y);
    }


    function toHLS(color, out) {
        /*
         * HLS: Hue, Luminance, Saturation
         * H: position in the spectrum
         * L: color lightness
         * S: color saturation
         */
        var r = color.r, g = color.g, b = color.b;
        var maxc = Math.max(r, g, b);
        var minc = Math.min(r, g, b);
        var h, l = (minc + maxc) / 2, s, dc = maxc - minc, rc, gc, bc;
        if (minc === maxc) {
            out.h = 0;
            out.l = l;
            out.s = 0;
            return;
        }
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
        out.h = numbers.mod(h/6, 1);
        out.l = l;
        out.s = s;
    }


    function toHSV(color, out) {
        /*
         * HSV: Hue, Saturation, Value
         * H: position in the spectrum
         * S: color saturation ("purity")
         * V: color brightness
         */
        var r = color.r, g = color.g, b = color.b;
        var maxc = Math.max(r, g, b);
        var minc = Math.min(r, g, b);
        var h, s, v = maxc, rc, gc, bc, dc = maxc - minc;
        if (minc === maxc) {
            out.h = out.s = 0;
            out.v = v;
            return;
        }
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
        out.h = numbers.mod(h/6, 1);
        out.s = s;
        out.v = v;
    }


    function pack(color) {
        /*
         * Converts three color components in range [0.0...1.0] to an integer. Examples:
         *
         *     pack({'r': 1, 'g': 1, 'b': 1}) --> 0xffffff
         *     pack({'r': 0, 'g': 0, 'b': 0}) --> 0x000000
         *     pack({'r': 1, 'g': 0, 'b': 0}) --> 0xff0000
         *     pack({'r': 0.5, 'g': 0.5, 'b': 0.5}) --> 0x7f7f7f
         */
        return color.r*255 << 16 | color.g*255 << 8 | color.b*255 << 0;
    }


    return {
        'create': create,
        'copy': copy,
        'toYIQ': toYIQ,
        'toHLS': toHLS,
        'toHSV': toHSV,
        'pack': pack
    };
});
