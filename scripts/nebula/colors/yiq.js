define('nebula/colors/yiq', function() {
    /*
     * YIQ: Luminance, Chrominance (used by composite video signals)
     *
     * Used by composite video signals (linear combinations of RGB)
     * Y: perceived grey level (0.0 == black, 1.0 == white)
     * I, Q: color components
     *
     * All inputs and outputs are numbers in range [0.0...1.0] (with the exception of I and Q, which
     * covers a slightly larger range). Inputs outside the valid range may cause exceptions or invalid outputs.
     *
     * References:
     * http://en.wikipedia.org/wiki/YIQ
     *
     * Adapted from http://hg.python.org/cpython/file/493d1ae3227b/Lib/colorsys.py
     * Copyright (c) 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013
     * Python Software Foundation; All Rights Reserved
     */
    'use strict';


    function toString() {
        return '[YIQ y:' + this.y + ' i:' + this.i + ' q:' + this.q + ']';
    }


    function create(y, i, q) {
        return {'y': y || 0, 'i': i || 0, 'q': q || 0, 'toString': toString};
    }


    function copy(color) {
        return create(color.y, color.i, color.q);
    }


    function toRGB(color, out) {
        /*
         * There are a great many versions of the constants used in these formulae. The ones in this library uses
         * constants from the FCC version of NTSC.
         */
        var y = color.y, i = color.i, q = color.q;
        var r = y + 0.9468822170900693*i + 0.6235565819861433*q;
        var g = y - 0.27478764629897834*i - 0.6356910791873801*q;
        var b = y - 1.1085450346420322*i + 1.7090069284064666*q;
        out.r = r > 1 ? 1 : (r < 0 ? 0 : r);
        out.g = g > 1 ? 1 : (g < 0 ? 0 : g);
        out.b = b > 1 ? 1 : (b < 0 ? 0 : b);
    }


    return define.functions(create, copy, toRGB);
});
