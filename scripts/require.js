/*
 * Allows for a simple module definition, similar to AMD, but without the A.
 *
 * WARNING: IE8 is not supported unless an `Object.create` polyfill is added.
 */
(function() {
    'use strict';


    function InvalidModuleNameError(moduleName) {
        this.message = "module name '" + moduleName + "' is invalid, only these characters are allowed: a-z, 0-9, _ and /";
    };

    InvalidModuleNameError.prototype = Object.create(TypeError.prototype);
    InvalidModuleNameError.prototype.name = 'InvalidModuleNameError';


    function InvalidModuleError(moduleName) {
        this.message = "module '" + moduleName + "' doesn't export any definitions";
    };

    InvalidModuleError.prototype = Object.create(TypeError.prototype);
    InvalidModuleError.prototype.name = 'InvalidModuleError';


    function DuplicateModuleError(moduleName) {
        this.message = "module '" + moduleName + "' is already defined";
    };

    DuplicateModuleError.prototype = Object.create(TypeError.prototype);
    DuplicateModuleError.prototype.name = 'DuplicateModuleError';


    function RequireError(moduleName) {
        this.message = "no module named '" + moduleName + "'";
    };

    RequireError.prototype = Object.create(ReferenceError.prototype);
    RequireError.prototype.name = 'RequireError';


    var namePattern = /^[a-z0-9_]+(?:\/[a-z0-9_]+)*$/;
    var modules = {
        /*
         * Custom user settings are stored under a `_settings` alias and the function below acts as a shortcut/getter.
         */
        'settings': function(name, fallback) {
            var settings = modules._settings || {};
            if (typeof settings[name] !== 'undefined')
                return settings[name];
            return fallback;
        },
    };


    function define(moduleName) {
        var dependencies = [], moduleCode, i, args;

        if (!namePattern.test(moduleName))
            throw new InvalidModuleNameError(moduleName);

        if (moduleName === 'settings')
            moduleName = '_settings';

        if (moduleName in modules)
            throw new DuplicateModuleError(moduleName);

        if (arguments.length === 3)
            dependencies = arguments[1];
        moduleCode = arguments[arguments.length - 1];

        if (typeof moduleCode === 'function') {
            args = [];
            for (i = 0; i < dependencies.length; i++)
                args.push(require(dependencies[i]));
            moduleCode = moduleCode.apply(this, args);
        }

        if (typeof moduleCode === 'undefined')
            throw new InvalidModuleError(moduleName);

        if (moduleName === 'jquery' && modules.settings('JQUERY_NO_CONFLICT', true))
            jQuery.noConflict(true);
        modules[moduleName] = moduleCode;
    }


    function require(moduleName) {
        if (moduleName in modules)
            return modules[moduleName];
        throw new RequireError(moduleName);
    }


    // Publicize things.
    define.amd = {'jQuery': true};
    define.modules = modules;
    define.InvalidModuleNameError = InvalidModuleNameError;
    define.InvalidModuleError = InvalidModuleError;
    define.DuplicateModuleError = DuplicateModuleError;
    define.RequireError = RequireError;

    window.define = define;
    window.require = require;

})();
