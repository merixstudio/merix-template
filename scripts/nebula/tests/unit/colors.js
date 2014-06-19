describe('colors.js', function() {
    /*
     * Copyright (c) 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010,
     * 2011, 2012, 2013 Python Software Foundation; All Rights Reserved
     *
     * Adapted from http://hg.python.org/cpython/file/493d1ae3227b/Lib/test/test_colorsys.py
     */
    var colors = require('nebula/colors');

    describe('RGB <-> HSV conversion', function() {
        it('converts a range of inputs', function() {
            for (var r = 0; r <= 1; r += 0.1)
                for (var g = 0; g <= 1; g += 0.1)
                    for (var b = 0; b <= 1; b += 0.1) {
                        var c = colors.rgb2hsv(r, g, b);
                        c = colors.hsv2rgb(c.h, c.s, c.v);
                        expect(c.r).toBeCloseTo(r, 14);
                        expect(c.g).toBeCloseTo(g, 14);
                        expect(c.b).toBeCloseTo(b, 14);
                    }
        });
        it('converts predefined color values', function() {
            var values = [
                //rgb,            hsv
                [[0,   0,   0  ], [  0, 0, 0  ]],  // black
                [[0,   0,   1  ], [4/6, 1, 1  ]],  // blue
                [[0,   1,   0  ], [2/6, 1, 1  ]],  // green
                [[0,   1,   1  ], [3/6, 1, 1  ]],  // cyan
                [[1,   0,   0  ], [  0, 1, 1  ]],  // red
                [[1,   0,   1  ], [5/6, 1, 1  ]],  // purple
                [[1,   1,   0  ], [1/6, 1, 1  ]],  // yellow
                [[1,   1,   1  ], [  0, 0, 1  ]],  // white
                [[0.5, 0.5, 0.5], [  0, 0, 0.5]]   // grey
            ];
            for (var i = 0; i < values.length; i++) {
                var rgb = values[i][0], hsv = values[i][1];
                var r = rgb[0], g = rgb[1], b = rgb[2], h = hsv[0], s = hsv[1], v = hsv[2];
                var hsv2 = colors.rgb2hsv(r, g, b);
                var rgb2 = colors.hsv2rgb(h, s, v);
                expect(rgb2.r).toBeCloseTo(r, 14);
                expect(rgb2.g).toBeCloseTo(g, 14);
                expect(rgb2.b).toBeCloseTo(b, 14);
                expect(hsv2.h).toBeCloseTo(h, 14);
                expect(hsv2.s).toBeCloseTo(s, 14);
                expect(hsv2.v).toBeCloseTo(v, 14);
            }
        });
    });

    describe('RGB <-> HLS conversion', function() {
        it('converts a range of inputs', function() {
            for (var r = 0; r <= 1; r += 0.1)
                for (var g = 0; g <= 1; g += 0.1)
                    for (var b = 0; b <= 1; b += 0.1) {
                        var c = colors.rgb2hls(r, g, b);
                        c = colors.hls2rgb(c.h, c.l, c.s);
                        expect(c.r).toBeCloseTo(r, 14);
                        expect(c.g).toBeCloseTo(g, 14);
                        expect(c.b).toBeCloseTo(b, 14);
                    }
        });
        it('converts predefined color values', function() {
            var values = [
                //rgb,            hls
                [[0,   0,   0  ], [  0, 0,   0]],  // black
                [[0,   0,   1  ], [4/6, 0.5, 1]],  // blue
                [[0,   1,   0  ], [2/6, 0.5, 1]],  // green
                [[0,   1,   1  ], [3/6, 0.5, 1]],  // cyan
                [[1,   0,   0  ], [  0, 0.5, 1]],  // red
                [[1,   0,   1  ], [5/6, 0.5, 1]],  // purple
                [[1,   1,   0  ], [1/6, 0.5, 1]],  // yellow
                [[1,   1,   1  ], [  0, 1,   0]],  // white
                [[0.5, 0.5, 0.5], [  0, 0.5, 0]]   // grey
            ];
            for (var i = 0; i < values.length; i++) {
                var rgb = values[i][0], hls = values[i][1];
                var r = rgb[0], g = rgb[1], b = rgb[2], h = hls[0], l = hls[1], s = hls[2];
                var hls2 = colors.rgb2hls(r, g, b);
                var rgb2 = colors.hls2rgb(h, l, s);
                expect(rgb2.r).toBeCloseTo(r, 14);
                expect(rgb2.g).toBeCloseTo(g, 14);
                expect(rgb2.b).toBeCloseTo(b, 14);
                expect(hls2.h).toBeCloseTo(h, 14);
                expect(hls2.l).toBeCloseTo(l, 14);
                expect(hls2.s).toBeCloseTo(s, 14);
            }
        });
    });

    describe('RGB <-> YIQ conversion', function() {
        it('converts a range of inputs', function() {
            for (var r = 0; r <= 1; r += 0.1)
                for (var g = 0; g <= 1; g += 0.1)
                    for (var b = 0; b <= 1; b += 0.1) {
                        var c = colors.rgb2yiq(r, g, b);
                        c = colors.yiq2rgb(c.y, c.i, c.q);
                        expect(c.r).toBeCloseTo(r, 14);
                        expect(c.g).toBeCloseTo(g, 14);
                        expect(c.b).toBeCloseTo(b, 14);
                    }
        });
        it('converts predefined color values', function() {
            var values = [
                //rgb,            yiq
                [[0,   0,   0  ], [0, 0, 0]],  // black
                [[0,   0,   1  ], [0.11, -0.3217, 0.3121]],  // blue
                [[0,   1,   0  ], [0.59, -0.2773, -0.5251]],  // green
                [[0,   1,   1  ], [0.7, -0.599, -0.213]],  // cyan
                [[1,   0,   0  ], [0.3, 0.599, 0.213]],  // red
                [[1,   0,   1  ], [0.41, 0.2773, 0.5251]],  // purple
                [[1,   1,   0  ], [0.89, 0.3217, -0.3121]],  // yellow
                [[1,   1,   1  ], [1, 0, 0]],  // white
                [[0.5, 0.5, 0.5], [0.5, 0, 0]]  // grey
            ];
            for (var n = 0; n < values.length; n++) {
                var rgb = values[n][0], yiq = values[n][1];
                var r = rgb[0], g = rgb[1], b = rgb[2], y = yiq[0], i = yiq[1], q = yiq[2];
                var yiq2 = colors.rgb2yiq(r, g, b);
                var rgb2 = colors.yiq2rgb(y, i, q);
                expect(rgb2.r).toBeCloseTo(r, 14);
                expect(rgb2.g).toBeCloseTo(g, 14);
                expect(rgb2.b).toBeCloseTo(b, 14);
                expect(yiq2.y).toBeCloseTo(y, 14);
                expect(yiq2.i).toBeCloseTo(i, 14);
                expect(yiq2.q).toBeCloseTo(q, 14);
            }
        });
    });
});
