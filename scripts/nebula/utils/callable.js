(function() {
    var module;

    if (Object.__proto__)
        module = function() {
            'use strict';
            function callable(F) {
                function C() {
                    function obj() {
                        C.prototype.call.apply(obj, arguments);
                    }
                    obj.__proto__ = C.prototype;
                    F.apply(obj, arguments);
                    return obj;
                }
                C.prototype = Object.create(Function.prototype);
                return C;
            }
            return callable;
        };
    else
        module = function() {
            /*
             * This code is targeting IE8 only, no other browsers were tested!
             */
            function sandbox(code) {
                var iframe = document.createElement('iframe');
                iframe.style.display = 'none';
                document.documentElement.appendChild(iframe);
                iframe = frames[frames.length - 1];
                var script = document.createElement('script');
                script.text = code;
                iframe.document.appendChild(script);
            }

            if (!Function.prototype.bind)
                throw new Error("`Function.prototype.bind` polyfill is required for the 'callable' module to work in this browser");

            var oldCallable = window.callable, callable;
            sandbox("\
                if (!Function.prototype.bind)\
                    Function.prototype.bind = parent.Function.prototype.bind;\
                parent.callable = function(F) {\
                    var C = function() {\
                        var obj = function() {\
                            C.prototype.call.apply(obj, arguments);\
                        };\
                        F.apply(obj, arguments);\
                        return obj;\
                    };\
                    C.prototype = Function.prototype;\
                    return C;\
                };\
                parent.callable.prototype = Function.prototype;\
                ");
            callable = window.callable;
            window.callable = oldCallable;
            return callable;
        };

    define('nebula/utils/callable', module);
})();
