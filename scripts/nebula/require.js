/*
 * Allows for a simple module definition, similar to AMD, but without the A.
 */
(function() {
    /*
     * Allows for a simple module definition, similar to AMD, but without the A.
     */
    'use strict';

    var modules = {};
    var namePattern = /^[a-z0-9_]+(?:\/[a-z0-9_]+)*$/;


    function format(template, moduleName) {
        return template.replace(/{module}/g, moduleName);
    }


    function exception(parentClass, name, template) {
        /*
         * Just a shortcut for creating exception classes.
         */
        function Exception(arg) {
            this.message = template ? format(template, arg) : arg;
        }
        Exception.prototype = Object.create(parentClass.prototype);
        Exception.prototype.name = name;
        Exception.prototype.constructor = Exception;
        return Exception;
    }


    var DefineError = exception(TypeError, 'define.Error');
    var DefineArgumentCountError = exception(DefineError, 'define.ArgumentCountError');
    var DefineInvalidModuleNameError = exception(DefineError, 'define.InvalidModuleNameError',
                                                 "module name '{module}' is invalid, allowed characters: a-z, 0-9, _ and /");
    var DefineInvalidModuleError = exception(DefineError, 'define.InvalidModuleError',
                                             "module '{module}' doesn't export any definitions");
    var DefineDuplicateModuleError = exception(DefineError, 'define.DuplicateModuleError',
                                               "module '{module}' is already defined");

    var RequireError = exception(TypeError, 'require.Error', "no module named '{module}'");
    var RequireArgumentsError = exception(RequireError, 'require.ArgumentsError');


    function require(path) {
        /*
         * Returns 'module' by name, from an internal module container. The 'module' must be 'defined' prior
         * to calling this function.
         */
        if (arguments.length !== 1 || typeof path !== 'string')
            throw new RequireArgumentsError('`require()` accepts only one argument and it must be a string with a module name');
        var parts = path.split('.'), name = parts[0], member = parts[1], module = modules[name];
        if (module) {
            if (typeof member === 'undefined')
                return module;
            if (member in module)
                return module[member];
        }
        throw new RequireError(path);
    }


    function define(moduleName) {
        /*
         * Allows to store given 'module' for later use. A module can be a single function or class constructor
         * or an object containing any of these as properties.
         */
        var dependencies = [], moduleCode, i, args;

        if (arguments.length < 2 || arguments.length > 3)
            throw new DefineArgumentCountError('`define()` accepts only two or three arguments');
        if (typeof moduleName !== 'string' || !namePattern.test(moduleName))
            throw new DefineInvalidModuleNameError(moduleName);
        if (moduleName === 'settings')
            moduleName = '_settings';
        if (moduleName in modules)
            throw new DefineDuplicateModuleError(moduleName);

        moduleCode = arguments[arguments.length - 1];
        if (arguments.length === 3) {
            if (typeof moduleCode !== 'function')
                throw new DefineError('redundant dependecies specified when module is not a function');
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
            throw new DefineInvalidModuleError(moduleName);

        if (moduleName === 'jquery' && modules.settings('JQUERY_NO_CONFLICT', true))
            jQuery.noConflict(true);
        modules[moduleName] = moduleCode;
    }


    function getSetting(name, fallback) {
        if (arguments.length < 1 || arguments.length > 2)
            throw new TypeError('settings getter accepts only one or two arguments');
        var settings = modules._settings || {};
        return name in settings ? settings[name] : fallback;
    }


    function init(_modules) {
        // Used in tests to clear all defined modules and settings.
        var old = modules;
        define._modules = modules = _modules || {'settings': getSetting};
        return old;
    }


    // Publicize things.
    require.Error = RequireError;
    require.ArgumentsError = RequireArgumentsError;
    define.Error = DefineError;
    define.ArgumentCountError = DefineArgumentCountError;
    define.InvalidModuleNameError = DefineInvalidModuleNameError;
    define.InvalidModuleError = DefineInvalidModuleError;
    define.DuplicateModuleError = DefineDuplicateModuleError;
    define.amd = {'jQuery': true};
    define._init = init;
    define._modules = modules;
    window.define = define;
    window.require = require;

    init();

})();
