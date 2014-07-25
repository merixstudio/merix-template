/*
 * Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf
 */
Object.setPrototypeOf = Object.setPrototypeOf || function(oInstance, oProto) {
    oInstance.__proto__ = oProto;
    return oInstance;
};


/*
 * Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
 */
if (!Array.prototype.indexOf)
    Array.prototype.indexOf = function(searchElement, fromIndex) {
        if (this === undefined || this === null)
            throw new TypeError('"this" is null or not defined');

        var length = this.length >>> 0;  // Hack to convert object.length to a UInt32
        fromIndex = +fromIndex || 0;

        if (Math.abs(fromIndex) === Infinity)
            fromIndex = 0;

        if (fromIndex < 0) {
            fromIndex += length;
            if (fromIndex < 0)
                fromIndex = 0;
        }

        for (; fromIndex < length; fromIndex++)
            if (this[fromIndex] === searchElement)
                return fromIndex;
        return -1;
    };


/*
 * addEventListener polyfill 1.0 / Eirik Backer / MIT Licence
 *
 * Source: https://gist.github.com/jonathantneal/3748027
 */
!window.addEventListener && (function(WindowPrototype, DocumentPrototype, ElementPrototype, addEventListener, removeEventListener, dispatchEvent, registry) {
    WindowPrototype[addEventListener] = DocumentPrototype[addEventListener] = ElementPrototype[addEventListener] = function(type, listener) {
        var target = this;

        registry.unshift([target, type, listener, function (event) {
            event.currentTarget = target;
            event.preventDefault = function () { event.returnValue = false };
            event.stopPropagation = function () { event.cancelBubble = true };
            event.target = event.srcElement || target;
            listener.call(target, event);
        }]);

        this.attachEvent('on' + type, registry[0][3]);
    };

    WindowPrototype[removeEventListener] = DocumentPrototype[removeEventListener] = ElementPrototype[removeEventListener] = function(type, listener) {
        for (var index = 0, register; register = registry[index]; ++index)
            if (register[0] == this && register[1] == type && register[2] == listener)
                return this.detachEvent('on' + type, registry.splice(index, 1)[0][3]);
    };

    WindowPrototype[dispatchEvent] = DocumentPrototype[dispatchEvent] = ElementPrototype[dispatchEvent] = function(eventObject) {
        return this.fireEvent('on' + eventObject.type, eventObject);
    };
})(Window.prototype, HTMLDocument.prototype, Element.prototype, 'addEventListener', 'removeEventListener', 'dispatchEvent', []);


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


/*
 * classList.js: Cross-browser full element.classList implementation.
 * 2012-11-15
 *
 * By Eli Grey, http://eligrey.com
 * Public Domain.
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 */
/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js*/

if (typeof document !== 'undefined' && !('classList' in document.documentElement)) {
    (function(view) {
        'use strict';

        if (!('HTMLElement' in view) && !('Element' in view))
            return;

        var classListProp = 'classList';
        var protoProp = 'prototype';
        var elemCtrProto = (view.HTMLElement || view.Element)[protoProp];
        var objCtr = Object;
        var strTrim = String[protoProp].trim || function () {
            return this.replace(/^\s+|\s+$/g, '');
        };
            // Vendors: please allow content code to instantiate DOMExceptions
        var DOMEx = function(type, message) {
            this.name = type;
            this.code = DOMException[type];
            this.message = message;
        }
        var checkTokenAndGetIndex = function(classList, token) {
            if (token === '')
                throw new DOMEx('SYNTAX_ERR', 'An invalid or illegal string was specified');
            if (/\s/.test(token))
                throw new DOMEx('INVALID_CHARACTER_ERR', 'String contains an invalid character');
            return Array[protoProp].indexOf.call(classList, token);
        };
        var ClassList = function(elem) {
            var trimmedClasses = strTrim.call(elem.className);
            var classes = trimmedClasses ? trimmedClasses.split(/\s+/) : [];
            var i = 0;
            var len = classes.length;
            for (; i < len; i++)
                this.push(classes[i]);
            this._updateClassName = function() {
                elem.className = this.toString();
            };
        };
        var classListProto = ClassList[protoProp] = [];
        var classListGetter = function() {
            return new ClassList(this);
        };
        // Most DOMException implementations don't allow calling DOMException's toString()
        // on non-DOMExceptions. Error's toString() is sufficient here.
        DOMEx[protoProp] = Error[protoProp];
        classListProto.item = function(i) {
            return this[i] || null;
        };
        classListProto.contains = function(token) {
            token += '';
            return checkTokenAndGetIndex(this, token) !== -1;
        };
        classListProto.add = function() {
            var tokens = arguments;
            var i = 0;
            var l = tokens.length;
            var token;
            var updated = false;

            do {
                token = tokens[i] + '';
                if (checkTokenAndGetIndex(this, token) === -1) {
                    this.push(token);
                    updated = true;
                }
            } while (++i < l);

            if (updated)
                this._updateClassName();
        };
        classListProto.remove = function() {
            var tokens = arguments;
            var i = 0;
            var l = tokens.length;
            var token;
            var updated = false;

            do {
                token = tokens[i] + '';
                var index = checkTokenAndGetIndex(this, token);
                if (index !== -1) {
                    this.splice(index, 1);
                    updated = true;
                }
            } while (++i < l);

            if (updated)
                this._updateClassName();
        };
        classListProto.toggle = function(token, force) {
            token += '';
            var result = this.contains(token);
            var method = result ? (force !== true && 'remove') : (force !== false && 'add');
            if (method)
                this[method](token);
            return !result;
        };
        classListProto.toString = function() {
            return this.join(' ');
        };

        if (objCtr.defineProperty) {
            var classListPropDesc = {
                'get': classListGetter,
                'enumerable': true,
                'configurable': true
            };
            try {
                objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
            } catch (ex) {  // IE 8 doesn't support enumerable:true
                if (ex.number === -0x7FF5EC54) {
                    classListPropDesc.enumerable = false;
                    objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
                }
            }
        } else if (objCtr[protoProp].__defineGetter__)
            elemCtrProto.__defineGetter__(classListProp, classListGetter);
    }(self));
}


// Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create
if (!Object.create)
    Object.create = (function(){
        function F(){}
        return function(o) {
            if (arguments.length != 1)
                throw new Error('Object.create implementation only accepts one parameter');
            F.prototype = o;
            return new F();
        };
    })();


// Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
if (!Function.prototype.bind)
    Function.prototype.bind = function(oThis) {
        if (typeof this !== 'function')
            // closest thing possible to the ECMAScript 5 internal IsCallable function
            throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');

        var aArgs = Array.prototype.slice.call(arguments, 1);
        var fToBind = this;
        var fNOP = function () {};
        var fBound = function () {
            return fToBind.apply(this instanceof fNOP && oThis ? this : oThis,
                                 aArgs.concat(Array.prototype.slice.call(arguments)));
        };

        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();
        return fBound;
    };


// Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now
if (!Date.now)
    Date.now = function now() {
        return new Date().getTime();
    };


// Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
if ('function' !== typeof Array.prototype.reduce)
    Array.prototype.reduce = function(callback /*, initialValue*/) {
        'use strict';
        if (null === this || 'undefined' === typeof this)
            throw new TypeError('Array.prototype.reduce called on null or undefined');

        if ('function' !== typeof callback)
            throw new TypeError( callback + ' is not a function' );

        var t = Object(this), len = t.length >>> 0, k = 0, value;

        if (arguments.length >= 2)
            value = arguments[1];
        else {
            while (k < len && ! k in t) k++;

            if (k >= len)
                throw new TypeError('Reduce of empty array with no initial value');

            value = t[k++];
        }

        for (; k < len; k++)
            if (k in t)
                value = callback(value, t[k], k, t);

        return value;
    };


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
