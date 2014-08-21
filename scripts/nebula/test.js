/*
 * Some unit testing helpers.
 */
define('nebula/test', function() {
    'use strict';


    function override(target, properties, callback) {
        var result, old = {}, name;
        for (name in properties) {
            old[name] = target[name];
            target[name] = properties[name];
        }
        result = callback();
        for (name in old)
            target[name] = old[name];
        return result;
    }


    function overrideSettings(newSettings, callback) {
        /*
         * Allows to override global settings, to help unit testing setting-dependent code.
         * Settings are overriden only for the time needed to execute provided callback and then old values
         * are restored.
         */
        define._modules._settings = define._modules._settings || {};
        return override(define._modules._settings, newSettings, callback);
    }


    function spy(values) {
        // Dead-simple spy that returns one of the provided values on each call and records call count.
        function s() {
            s.calls += 1;
            return values[s.calls - 1];
        }
        s.calls = 0;
        return s;
    }


    return define.functions(overrideSettings, spy);
});
