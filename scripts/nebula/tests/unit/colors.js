describe('colors', function() {
    /*
     * Copyright (c) 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010,
     * 2011, 2012, 2013 Python Software Foundation; All Rights Reserved
     *
     * Adapted from http://hg.python.org/cpython/file/493d1ae3227b/Lib/test/test_colorsys.py
     */
    var hls = require('nebula/colors/hls');
    var hsv = require('nebula/colors/hsv');
    var rgb = require('nebula/colors/rgb');
    var yiq = require('nebula/colors/yiq');


    function expectHLS(color, h, l, s) {
        expect(color.h).toBeCloseTo(h, 14);
        expect(color.l).toBeCloseTo(l, 14);
        expect(color.s).toBeCloseTo(s, 14);
    }

    function expectHSV(color, h, s, v) {
        expect(color.h).toBeCloseTo(h, 14);
        expect(color.s).toBeCloseTo(s, 14);
        expect(color.v).toBeCloseTo(v, 14);
    }

    function expectRGB(color, r, g, b) {
        expect(color.r).toBeCloseTo(r, 14);
        expect(color.g).toBeCloseTo(g, 14);
        expect(color.b).toBeCloseTo(b, 14);
    }

    function expectYIQ(color, y, i, q) {
        expect(color.y).toBeCloseTo(y, 14);
        expect(color.i).toBeCloseTo(i, 14);
        expect(color.q).toBeCloseTo(q, 14);
    }


    describe('RGB <-> HSV conversion', function() {
        it('converts a range of inputs', function() {
            var colorRGB = rgb.create();
            var colorHSV = hsv.create();
            for (var r = 0; r <= 1; r += 0.1)
                for (var g = 0; g <= 1; g += 0.1)
                    for (var b = 0; b <= 1; b += 0.1) {
                        rgb.toHSV({'r': r, 'g': g, 'b': b}, colorHSV);
                        hsv.toRGB(colorHSV, colorRGB);
                        expectRGB(colorRGB, r, g, b);
                    }
        });
        it('converts predefined color values', function() {
            var colors = [
                [{'r': 0.0, 'g': 0.0, 'b': 0.0}, {'h':   0, 's': 0, 'v': 0.0}],  // black
                [{'r': 0.0, 'g': 0.0, 'b': 1.0}, {'h': 4/6, 's': 1, 'v': 1.0}],  // blue
                [{'r': 0.0, 'g': 1.0, 'b': 0.0}, {'h': 2/6, 's': 1, 'v': 1.0}],  // green
                [{'r': 0.0, 'g': 1.0, 'b': 1.0}, {'h': 3/6, 's': 1, 'v': 1.0}],  // cyan
                [{'r': 1.0, 'g': 0.0, 'b': 0.0}, {'h':   0, 's': 1, 'v': 1.0}],  // red
                [{'r': 1.0, 'g': 0.0, 'b': 1.0}, {'h': 5/6, 's': 1, 'v': 1.0}],  // purple
                [{'r': 1.0, 'g': 1.0, 'b': 0.0}, {'h': 1/6, 's': 1, 'v': 1.0}],  // yellow
                [{'r': 1.0, 'g': 1.0, 'b': 1.0}, {'h':   0, 's': 0, 'v': 1.0}],  // white
                [{'r': 0.5, 'g': 0.5, 'b': 0.5}, {'h':   0, 's': 0, 'v': 0.5}]   // grey
            ];
            var colorRGB = rgb.create(), colorHSV = hsv.create();
            for (var i = 0; i < colors.length; i++) {
                var initialRGB = colors[i][0], initialHSV = colors[i][1];
                rgb.toHSV(initialRGB, colorHSV);
                hsv.toRGB(initialHSV, colorRGB);
                expectRGB(colorRGB, initialRGB.r, initialRGB.g, initialRGB.b);
                expectHSV(colorHSV, initialHSV.h, initialHSV.s, initialHSV.v);
            }
        });
    });

    describe('RGB <-> HLS conversion', function() {
        it('converts a range of inputs', function() {
            var colorRGB = rgb.create();
            var colorHLS = hls.create();
            for (var r = 0; r <= 1; r += 0.1)
                for (var g = 0; g <= 1; g += 0.1)
                    for (var b = 0; b <= 1; b += 0.1) {
                        rgb.toHLS({'r': r, 'g': g, 'b': b}, colorHLS);
                        hls.toRGB(colorHLS, colorRGB);
                        expectRGB(colorRGB, r, g, b);
                    }
        });
        it('converts predefined color values', function() {
            var colors = [
                [{'r': 0.0, 'g': 0.0, 'b': 0.0}, {'h':   0, 'l': 0.0, 's': 0}],  // black
                [{'r': 0.0, 'g': 0.0, 'b': 1.0}, {'h': 4/6, 'l': 0.5, 's': 1}],  // blue
                [{'r': 0.0, 'g': 1.0, 'b': 0.0}, {'h': 2/6, 'l': 0.5, 's': 1}],  // green
                [{'r': 0.0, 'g': 1.0, 'b': 1.0}, {'h': 3/6, 'l': 0.5, 's': 1}],  // cyan
                [{'r': 1.0, 'g': 0.0, 'b': 0.0}, {'h':   0, 'l': 0.5, 's': 1}],  // red
                [{'r': 1.0, 'g': 0.0, 'b': 1.0}, {'h': 5/6, 'l': 0.5, 's': 1}],  // purple
                [{'r': 1.0, 'g': 1.0, 'b': 0.0}, {'h': 1/6, 'l': 0.5, 's': 1}],  // yellow
                [{'r': 1.0, 'g': 1.0, 'b': 1.0}, {'h':   0, 'l': 1.0, 's': 0}],  // white
                [{'r': 0.5, 'g': 0.5, 'b': 0.5}, {'h':   0, 'l': 0.5, 's': 0}]   // grey
            ];
            var colorRGB = rgb.create(), colorHLS = hls.create();
            for (var i = 0; i < colors.length; i++) {
                var initialRGB = colors[i][0], initialHLS = colors[i][1];
                rgb.toHLS(initialRGB, colorHLS);
                hls.toRGB(initialHLS, colorRGB);
                expectRGB(colorRGB, initialRGB.r, initialRGB.g, initialRGB.b);
                expectHLS(colorHLS, initialHLS.h, initialHLS.l, initialHLS.s);
            }
        });
    });

    describe('RGB <-> YIQ conversion', function() {
        it('converts a range of inputs', function() {
            var colorRGB = rgb.create();
            var colorYIQ = yiq.create();
            for (var r = 0; r <= 1; r += 0.1)
                for (var g = 0; g <= 1; g += 0.1)
                    for (var b = 0; b <= 1; b += 0.1) {
                        rgb.toYIQ({'r': r, 'g': g, 'b': b}, colorYIQ);
                        yiq.toRGB(colorYIQ, colorRGB);
                        expectRGB(colorRGB, r, g, b);
                    }
        });
        it('converts predefined color values', function() {
            var colors = [
                [{'r': 0.0, 'g': 0.0, 'b': 0.0}, {'y': 0.0, 'i': 0.0, 'q': 0.0}],  // black
                [{'r': 0.0, 'g': 0.0, 'b': 1.0}, {'y': 0.11, 'i': -0.3217, 'q': 0.3121}],  // blue
                [{'r': 0.0, 'g': 1.0, 'b': 0.0}, {'y': 0.59, 'i': -0.2773, 'q': -0.5251}],  // green
                [{'r': 0.0, 'g': 1.0, 'b': 1.0}, {'y': 0.7, 'i': -0.599, 'q': -0.213}],  // cyan
                [{'r': 1.0, 'g': 0.0, 'b': 0.0}, {'y': 0.3, 'i': 0.599, 'q': 0.213}],  // red
                [{'r': 1.0, 'g': 0.0, 'b': 1.0}, {'y': 0.41, 'i': 0.2773, 'q': 0.5251}],  // purple
                [{'r': 1.0, 'g': 1.0, 'b': 0.0}, {'y': 0.89, 'i': 0.3217, 'q': -0.3121}],  // yellow
                [{'r': 1.0, 'g': 1.0, 'b': 1.0}, {'y': 1.0, 'i': 0.0, 'q': 0.0}],  // white
                [{'r': 0.5, 'g': 0.5, 'b': 0.5}, {'y': 0.5, 'i': 0.0, 'q': 0.0}]  // grey
            ];
            var colorRGB = rgb.create(), colorYIQ = yiq.create();
            for (var i = 0; i < colors.length; i++) {
                var initialRGB = colors[i][0], initialYIQ = colors[i][1];
                rgb.toYIQ(initialRGB, colorYIQ);
                yiq.toRGB(initialYIQ, colorRGB);
                expectRGB(colorRGB, initialRGB.r, initialRGB.g, initialRGB.b);
                expectYIQ(colorYIQ, initialYIQ.y, initialYIQ.i, initialYIQ.q);
            }
        });
    });

    describe('`rgb.pack()`', function() {
        it('converts three numbers to an unsigned integer', function() {
            var values = [
                [{'r': 0.0, 'g': 0.0, 'b': 0.0}, 0x000000],  // black
                [{'r': 0.5, 'g': 0.5, 'b': 0.5}, 0x7f7f7f],  // grey
                [{'r': 1.0, 'g': 1.0, 'b': 1.0}, 0xffffff],  // white
                [{'r': 1.0, 'g': 0.0, 'b': 0.0}, 0xff0000],  // red
                [{'r': 0.0, 'g': 1.0, 'b': 0.0}, 0x00ff00],  // green
                [{'r': 0.0, 'g': 0.0, 'b': 1.0}, 0x0000ff],  // blue
                [{'r': 0.0, 'g': 1.0, 'b': 1.0}, 0x00ffff],  // cyan
                [{'r': 1.0, 'g': 0.0, 'b': 1.0}, 0xff00ff],  // purple
                [{'r': 1.0, 'g': 1.0, 'b': 0.0}, 0xffff00]   // yellow
            ];
            for (var i = 0; i < values.length; i++)
                expect(rgb.pack(values[i][0])).toBe(values[i][1]);
        });
    });

    describe('`hls.toString()`', function() {
        it('returns HLS color representation as string', function() {
            expect(String(hls.create(0.0, 0.0, 0.0))).toBe('[HLS h:0 l:0 s:0]');
            expect(String(hls.create(0.1, 0.2, 0.3))).toBe('[HLS h:0.1 l:0.2 s:0.3]');
            expect(String(hls.create(1.0, 1.0, 1.0))).toBe('[HLS h:1 l:1 s:1]');
        });
    });

    describe('`hls.create()`', function() {
        it('returns HLS color object with h, l and s components', function() {
            var color = hls.create(0.1, 0.2, 0.3);
            expect(color.h).toBe(0.1);
            expect(color.l).toBe(0.2);
            expect(color.s).toBe(0.3);
        });
    });

    describe('`hls.copy()`', function() {
        it('returns HLS color object with h, l and s components copied from an other color object', function() {
            var color = hls.create(0.1, 0.2, 0.3);
            var colorCopy = hls.copy(color);
            expect(colorCopy.h).toBe(0.1);
            expect(colorCopy.l).toBe(0.2);
            expect(colorCopy.s).toBe(0.3);
        });
    });

    describe('`hsv.toString()`', function() {
        it('returns HSV color representation as string', function() {
            expect(String(hsv.create(0.0, 0.0, 0.0))).toBe('[HSV h:0 s:0 v:0]');
            expect(String(hsv.create(0.1, 0.2, 0.3))).toBe('[HSV h:0.1 s:0.2 v:0.3]');
            expect(String(hsv.create(1.0, 1.0, 1.0))).toBe('[HSV h:1 s:1 v:1]');
        });
    });

    describe('`hsv.create()`', function() {
        it('returns HSV color object with h, s and v components', function() {
            var color = hsv.create(0.1, 0.2, 0.3);
            expect(color.h).toBe(0.1);
            expect(color.s).toBe(0.2);
            expect(color.v).toBe(0.3);
        });
    });

    describe('`hsv.copy()`', function() {
        it('returns HSV color object with h, s and v components copied from an other color object', function() {
            var color = hsv.create(0.1, 0.2, 0.3);
            var colorCopy = hsv.copy(color);
            expect(colorCopy.h).toBe(0.1);
            expect(colorCopy.s).toBe(0.2);
            expect(colorCopy.v).toBe(0.3);
        });
    });

    describe('`rgb.toString()`', function() {
        it('returns RGB color representation as string', function() {
            expect(String(rgb.create(0.0, 0.0, 0.0))).toBe('[RGB r:0 g:0 b:0]');
            expect(String(rgb.create(0.1, 0.2, 0.3))).toBe('[RGB r:0.1 g:0.2 b:0.3]');
            expect(String(rgb.create(1.0, 1.0, 1.0))).toBe('[RGB r:1 g:1 b:1]');
        });
    });

    describe('`rgb.valueOf()`', function() {
        it('returns RGB color representation as unsigned integer', function() {
            expect(Number(rgb.create(0.0, 0.0, 0.0))).toBe(0x000000);
            expect(Number(rgb.create(0.5, 0.5, 0.5))).toBe(0x7f7f7f);
            expect(Number(rgb.create(1.0, 1.0, 1.0))).toBe(0xffffff);
        });
    });

    describe('`rgb.create()`', function() {
        it('returns RGB color object with r, g and b components', function() {
            var color = rgb.create(0.1, 0.2, 0.3);
            expect(color.r).toBe(0.1);
            expect(color.g).toBe(0.2);
            expect(color.b).toBe(0.3);
        });
    });

    describe('`rgb.copy()`', function() {
        it('returns RGB color object with r, g and b components copied from an other color object', function() {
            var color = rgb.create(0.1, 0.2, 0.3);
            var colorCopy = rgb.copy(color);
            expect(colorCopy.r).toBe(0.1);
            expect(colorCopy.g).toBe(0.2);
            expect(colorCopy.b).toBe(0.3);
        });
    });

    describe('`yiq.toString()`', function() {
        it('returns YIQ color representation as string', function() {
            expect(String(yiq.create(0.0, 0.0, 0.0))).toBe('[YIQ y:0 i:0 q:0]');
            expect(String(yiq.create(0.1, 0.2, 0.3))).toBe('[YIQ y:0.1 i:0.2 q:0.3]');
            expect(String(yiq.create(1.0, 1.0, 1.0))).toBe('[YIQ y:1 i:1 q:1]');
        });
    });

    describe('`yiq.create()`', function() {
        it('returns YIQ color object with y, i and q components', function() {
            var color = yiq.create(0.1, 0.2, 0.3);
            expect(color.y).toBe(0.1);
            expect(color.i).toBe(0.2);
            expect(color.q).toBe(0.3);
        });
    });

    describe('`yiq.copy()`', function() {
        it('returns YIQ color object with y, i and q components copied from an other color object', function() {
            var color = yiq.create(0.1, 0.2, 0.3);
            var colorCopy = yiq.copy(color);
            expect(colorCopy.y).toBe(0.1);
            expect(colorCopy.i).toBe(0.2);
            expect(colorCopy.q).toBe(0.3);
        });
    });
});
