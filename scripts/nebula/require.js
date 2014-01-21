/*
 * Allows for a simple module definition, similar to AMD, but without the A.
 */
(function() {
    /*
     * Allows for a simple module definition, similar to AMD, but without the A.
     */
    'use strict';

    function initialModules() {
        /*
         * Custom user settings are stored under a `_settings` alias and the function below acts as a shortcut/getter.
         */
        return {
            'settings': function(name, fallback) {
                if (arguments.length < 1 || arguments.length > 2)
                    throw new TypeError('settings getter accepts only one or two arguments');
                var settings = define.modules._settings || {};
                return name in settings ? settings[name] : fallback;
            }
        };
    }

    var namePattern = /^[a-z0-9_]+(?:\/[a-z0-9_]+)*$/;

    // Used in tests to clear all defined modules and settings.
    function reset() {
        define.modules = initialModules();
    }

    /*
     * Allows to store given 'module' for later use. A module can be a single function or class constructor
     * or an object containing any of these as properties.
     */
    function define(moduleName) {
        var dependencies = [], moduleCode, i, args;

        if (arguments.length < 2 || arguments.length > 3)
            throw new define.ArgumentCountError();
        if (typeof moduleName !== 'string' || !namePattern.test(moduleName))
            throw new define.InvalidModuleNameError(moduleName);
        if (moduleName === 'settings')
            moduleName = '_settings';
        if (moduleName in define.modules)
            throw new define.DuplicateModuleError(moduleName);

        moduleCode = arguments[arguments.length - 1];
        if (arguments.length === 3) {
            if (typeof moduleCode !== 'function')
                throw new define.Error('redundant dependecies specified when module is not a function');
            dependencies = arguments[1];
        }

        if (typeof moduleCode === 'function') {
            // Collect required dependencies for the currently defined module.
            args = [];
            for (i = 0; i < dependencies.length; i++)
                args.push(require(dependencies[i]));
            moduleCode = moduleCode.apply(this, args);
        }

        if (arguments.length < 2 || typeof moduleCode === 'undefined')
            throw new define.InvalidModuleError(moduleName);

        if (moduleName === 'jquery' && define.modules.settings('JQUERY_NO_CONFLICT', true))
            jQuery.noConflict(true);
        define.modules[moduleName] = moduleCode;
    }

    /*
     * Returns 'module' by name, from an internal module container. The 'module' must be 'defined' prior to calling
     * this function.
     */
    function require(moduleName) {
        if (arguments.length !== 1 || typeof moduleName !== 'string')
            throw new require.ArgumentsError();
        if (moduleName in define.modules)
            return define.modules[moduleName];
        throw new require.Error(moduleName);
    }

    function makeException(parentObject, parentClass, name, message) {
        function Exception() {
            this.message = (typeof message === 'function') ? message.apply(null, arguments) : message;
        }
        var shortName = name.split('.');
        shortName = shortName[shortName.length - 1];
        Exception.prototype = Object.create(parentClass.prototype);
        Exception.prototype.name = name;
        Exception.prototype.constructor = Exception;
        parentObject[shortName] = Exception;
    }

    function passMessage(message) {
        return message;
    }

    function alreadyDefinedMessage(moduleName) {
        return "module '" + moduleName + "' is already defined";
    }

    function noExportsMessage(moduleName) {
        return "module '" + moduleName + "' doesn't export any definitions";
    }

    function invalidCharsMessage(moduleName) {
        return "module name '" + moduleName + "' is invalid, allowed characters: a-z, 0-9, _ and /";
    }

    function notFoundMessage(moduleName) {
        return "no module named '" + moduleName + "'";
    }

    makeException(define, TypeError, 'define.Error', passMessage);
    makeException(define, define.Error, 'define.ArgumentCountError', '`define()` accepts only two or three arguments');
    makeException(define, define.Error, 'define.InvalidModuleNameError', invalidCharsMessage);
    makeException(define, define.Error, 'define.InvalidModuleError', noExportsMessage);
    makeException(define, define.Error, 'define.DuplicateModuleError', alreadyDefinedMessage);

    makeException(require, TypeError, 'require.Error', notFoundMessage);
    makeException(require, TypeError, 'require.ArgumentsError',
                  '`require()` accepts only one argument and it must be a string with a module name');

    // Publicize things.
    define.amd = {'jQuery': true};
    define._reset = reset;
    define.modules = initialModules();
    window.define = define;
    window.require = require;

})();
