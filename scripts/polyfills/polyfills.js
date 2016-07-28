/*
 * matchMedia() polyfill - Test a CSS media type/query in JS.
 * Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas, David Knight. Dual MIT/BSD license
 *
 * Source: https://github.com/paulirish/matchMedia.js/blob/master/matchMedia.js
 */
window.matchMedia || (window.matchMedia = function() {
    'use strict';

    // For browsers that support matchMedium api such as IE 9 and webkit
    var styleMedia = (window.styleMedia || window.media);

    // For those that don't support matchMedium
    if (!styleMedia) {
        var style = document.createElement('style');
        var script = document.getElementsByTagName('script')[0];
        var info = null;

        style.type = 'text/css';
        style.id = 'matchmediajs-test';
        script.parentNode.insertBefore(style, script);

        // 'style.currentStyle' is used by IE <= 8 and 'window.getComputedStyle' for all other browsers
        info = ('getComputedStyle' in window) && window.getComputedStyle(style, null) || style.currentStyle;

        styleMedia = {
            'matchMedium': function(media) {
                var text = '@media ' + media + '{ #matchmediajs-test { width: 1px; } }';

                // 'style.styleSheet' is used by IE <= 8 and 'style.textContent' for all other browsers
                if (style.styleSheet)
                    style.styleSheet.cssText = text;
                else
                    style.textContent = text;

                // Test if media query is true or false
                return info.width === '1px';
            }
        };
    }

    return function(media) {
        return {
            'matches': styleMedia.matchMedium(media || 'all'),
            'media': media || 'all'
        };
    };
}());


// Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sign#Browser_compatibility
if (!Math.sign)
    Math.sign = function sign(n) {
        n = Number(n);
        return n ? n < 0 ? -1 : 1 : n === n ? n : NaN;
    };


// Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/log2#Browser_compatibility
if (!Math.log2)
    Math.log2 = function log2(n) {
        return Math.log(n) / Math.LN2;
    };


// Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/trunc
if (!Math.trunc)
    Math.trunc = function trunc(n) {
        return n < 0 ? Math.ceil(n) : Math.floor(n);
    };


// Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/tanh
if (!Math.tanh)
    Math.tanh = function tanh(n) {
        if (n === Infinity)
            return 1;
        else if (n === -Infinity)
            return -1;
        else {
            var y = Math.exp(2 * n);
            return (y - 1) / (y + 1);
        }
    };


// Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sinh
if (!Math.sinh)
    Math.sinh = function sinh(n) {
        var y = Math.exp(n);
        return (y - 1/y) / 2;
    };


// Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/log1p
if (!Math.log1p)
    Math.log1p = function log1p(n) {
        return Math.log(1 + n);
    };


// Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/log10
if (!Math.log10)
    Math.log10 = function log10(n) {
        return Math.log(n) / Math.LN10;
    };


// Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/imul
if (!Math.imul)
    Math.imul = function imul(a, b) {
        var ah  = (a >>> 16) & 0xffff;
        var al = a & 0xffff;
        var bh  = (b >>> 16) & 0xffff;
        var bl = b & 0xffff;
        // the shift by 0 fixes the sign on the high part
        // the final |0 converts the unsigned value into a signed value
        return ((al * bl) + (((ah * bl + al * bh) << 16) >>> 0)|0);
    };


// Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/hypot
if (!Math.hypot)
    Math.hypot = function hypot() {
        var sum = 0, n, i = arguments.length;
        while (i--) {
            n = arguments[i];
            if (n === Infinity || n === -Infinity)
                return Infinity;
            sum += n*n;
        }
        return Math.sqrt(sum);
    };


// Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/fround
if (!Math.fround)
    Math.fround = function fround(n) {
        var f32 = new Float32Array(1);
        return f32[0] = n, f32[0];
    };


// Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/expm1
if (!Math.expm1)
    Math.expm1 = function expm1(n) {
        return Math.exp(n) - 1;
    };


// Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/cosh
if (!Math.cosh)
    Math.cosh = function cosh(n) {
        var y = Math.exp(n);
        return (y + 1 / y) / 2;
    };


// Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/clz32
if (!Math.clz32)
    Math.clz32 = function clz32(n) {
        n = Number(n) >>> 0;
        return n ? 32 - n.toString(2).length : 32;
    };


// Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/cbrt
if (!Math.cbrt)
    Math.cbrt = function cbrt(n) {
        var y = Math.pow(Math.abs(n), 1/3);
        return n < 0 ? -y : y;
    };


// Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/atanh
if (!Math.atanh)
    Math.atanh = function atanh(n) {
        return Math.log((1+n) / (1-n)) / 2;
    };


// Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/asinh
if (!Math.asinh)
    Math.asinh = function asinh(n) {
        if (n === -Infinity)
            return n;
        else
            return Math.log(n + Math.sqrt(n*n + 1));
    };


// Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/acosh
if (!Math.acosh)
    Math.acosh = function acosh(n) {
        return Math.log(n + Math.sqrt(n*n - 1));
    };
