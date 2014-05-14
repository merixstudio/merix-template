define('nebula/utils/callable', function() {
    /*
     * There are two implementations of the callable decorator bellow. The `protoCallable()` is used in modern
     * browsers and `iframeCallable()` is used only in IE8.
     *
     * `callable()` is a function (also called decorator) that turns JavaScript objects into callable functions.
     * Converted object must implement a method `__call__()` that will be executed when object is used like a function.
     *
     * Example usage:
     *
     *     // Defining a class of objects
     *     function Car(doors) {
     *         this.doors = doors;
     *     }
     *
     *     // Decorating constructor
     *     Car = callable(Car);
     *
     *     // This will be executed when object is used as a function
     *     Car.prototype.__call__ = function() {
     *         alert(this.doors);
     *     };
     *
     *     // Actually using an instance of a Car
     *     var car = new Car(4);
     *     car();  // Invokes the `__call__()` method.
     */
    'use strict';


    function protoCallable(cls) {
        function C() {
            function obj() {
                if (typeof C.prototype.call !== 'function')
                    throw new TypeError('Callable objects must have a `__call__()` method.');
                return C.prototype.__call__.apply(obj, arguments);
            }
            Object.setPrototypeOf(obj, C.prototype);
            cls.apply(obj, arguments);
            return obj;
        }
        C.prototype = Object.create(Function.prototype);
        return C;
    }


    function sandbox(code) {
        /*
         * Runs JavaScript code block in an iframe. Used as a helper in IE8 only.
         */
        var iframe = document.createElement('iframe');
        var script = document.createElement('script');
        iframe.style.display = 'none';
        document.documentElement.appendChild(iframe);
        iframe = frames[frames.length - 1];
        script.text = code;
        iframe.document.appendChild(script);
        return iframe;
    }


    function iframeCallable(cls) {
        /*
         * This code is targeting IE8 only.
         */
        var oldCallable = window.callable, _callable, _error;
        sandbox("\
            Function.prototype.bind = parent.Function.prototype.bind;\
            parent.callable = function(cls) {\
                function C() {\
                    function obj() {\
                        return C.prototype.__call__.apply(obj, arguments);\
                    }\
                    cls.apply(obj, arguments);\
                    return obj;\
                }\
                C.prototype = Function.prototype;\
                return C;\
            };\
            parent.callable.prototype = Function.prototype;");
        _callable = window.callable;
        window.callable = oldCallable;
        return _callable(cls);
    }


    if (!Object.__proto__ && !Function.prototype.bind)
        throw new Error("`Function.prototype.bind` polyfill is required for the `callable()` decorator to work in this browser");
    return Object.__proto__ ? protoCallable : iframeCallable;
});
