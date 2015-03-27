(function() {
    /*
     * Allows for a simple module definition, similar to AMD, without the A, but with some other goodies.
     *
     * Syntax:
     *     define('module_name', ['dependencies'], function(...) {
     *         // Module code goes here: functions, classes and constants.
     *         // To export definitions, so other modules can access them two syntaxes are possible:
     *         this.someFunction = function() { ... };
     *
     *         // Or:
     *
     *         function someFunction() { ... }
     *
     *         return {
     *             'someFunction': someFunction
     *         };
     *     });
     *
     *     // To retrieve module use `require()`.
     *     var moduleName = require('module_name');
     *
     */
    'use strict';

    var SETTINGS_SELECTOR = 'script[type="application/vnd.nebula-settings+json"]';
    var winAPI;
    var modules = {};
    var constructors = {};
    var namePattern = /^[a-z0-9_]+(?:\/[a-z0-9_]+)*$/;
    var codeSettingsDefined = false;


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


    function instantiate(Constructor, dependencies) {
        return new (Function.prototype.bind.apply(Constructor, [{}].concat(dependencies)));
    }


    function require(path, overrides) {
        /*
         * Returns 'module' by name, from an internal module container. The 'module' must be 'defined' prior
         * to calling this function.
         *
         * `overrides` can be used to replace some dependencies with custom implementations - useful for unit testing.
         */
        if (arguments.length < 1 || arguments.length > 2 || typeof path !== 'string')
            throw new RequireArgumentsError('`require()` accepts only one or two arguments');
        var parts = path.split('.'), name = parts[0], member = parts[1], module;
        if (overrides) {
            if (!(path in constructors))
                throw new RequireError(path);
            // If `overrides` is specified instantiate a new module instance.
            var dependencies = [];
            for (var i = 0; i < constructors[path].dependencies.length; i++) {
                var depPath = constructors[path].dependencies[i];
                dependencies.push(depPath in overrides ? overrides[depPath] : require(depPath));
            }
            module = instantiate(constructors[path].constructor, dependencies);
        } else
            module = modules[name];
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
        var dependencies = [], moduleCode;

        if (arguments.length < 2 || arguments.length > 3)
            throw new DefineArgumentCountError('`define()` accepts only two or three arguments');
        if (typeof moduleName !== 'string')
            throw new DefineInvalidModuleNameError(moduleName);
        if (!namePattern.test(moduleName)) {
            var settings = require('settings');
            var ALIASES = settings('ALIASES', {});
            if (moduleName in ALIASES) {
                var callArgs = [ALIASES[moduleName]].concat(Array.prototype.slice.call(arguments, 1));
                return define.apply(undefined, callArgs);
            }
            throw new DefineInvalidModuleNameError(moduleName);
        }
        if ((moduleName in modules && moduleName !== 'settings') || (codeSettingsDefined && moduleName === 'settings'))
            throw new DefineDuplicateModuleError(moduleName);

        moduleCode = arguments[arguments.length - 1];
        if (arguments.length === 3) {
            if (typeof moduleCode !== 'function')
                throw new DefineError('redundant dependecies specified when module is not a function');
            dependencies = arguments[1];
        }

        if (typeof moduleCode === 'function') {
            // Collect required dependencies for the currently defined module.
            constructors[moduleName] = {'constructor': moduleCode, 'dependencies': dependencies};
            var args = [];
            for (var i = 0; i < dependencies.length; i++)
                args.push(require(dependencies[i]));
            moduleCode = instantiate(moduleCode, args);
        }

        if (arguments.length < 2 || typeof moduleCode === 'undefined')
            throw new DefineInvalidModuleError(moduleName);

        if (moduleName === 'settings') {
            codeSettingsDefined = true;
            for (var name in moduleCode)
                if (!(name in modules._settings))
                    modules._settings[name] = moduleCode[name];
        } else
            modules[moduleName] = moduleCode;
    }


    function functionName(func) {
        /*
         * Returns name of a function by extracting it from function's source code.
         */
        var pattern = /^\s*function\s+([^\s\(]+).*/i;
        var body = String(func);
        var match = pattern.exec(body);
        return match.length === 2 ? match[1] : null;
    }


    function functions() {
        /*
         * Converts functions in arguments to an object whose keys are function names, and values are those functions.
         */
        var map = {}, name;
        for (var i = 0; i < arguments.length; i++) {
            if (typeof arguments[i] !== 'function')
                throw new TypeError('argument ' + (i+1) + ' is not a function');
            name = functionName(arguments[i]);
            if (name === null)
                throw new Error("couldn't get function name for argument " + (i+1));
            map[name] = arguments[i];
        }
        return map;
    }


    function getSetting(name, fallback) {
        if (arguments.length < 1 || arguments.length > 2)
            throw new TypeError('settings getter accepts only one or two arguments');
        var settings = modules._settings || {};
        return name in settings ? settings[name] : fallback;
    }


    function getHTMLSettings(initial) {
        /*
         * Loads settings from DOM, from <script> tags containing JSON and the type attribute set to
         * "application/vnd.nebula-settings+json". Example:
         *
         *     <script type="application/vnd.nebula-settings+json">
         *         {
         *             "DEBUG": true,
         *             "STATIC_URL": "/static/"
         *         }
         *     </script>
         */
        initial = initial || {};
        var tags = winAPI.document.querySelectorAll(SETTINGS_SELECTOR);
        if (tags.length > 1)
            throw new DefineError('multiple settings defined in HTML, only one `<script>` tag with settings is allowed');
        if (tags.length) {
            try {
                var settings = winAPI.JSON.parse(tags[0].innerHTML);
            } catch(e) {
                if (e instanceof SyntaxError)
                    throw new DefineError('invalid syntax in the HTML settings: ' + e.message);
                throw e;
            }
            for (var name in settings)
                initial[name] = settings[name];
        }
        return initial;
    }


    function init(_modules, _constructors, _winAPI) {
        // Used in tests to clear all defined modules and settings.
        var old = modules;
        winAPI = _winAPI || window;
        codeSettingsDefined = false;
        define._constructors = constructors = _constructors || {};
        define._modules = modules = _modules || {'settings': getSetting, '_settings': {}};
        modules._settings = getHTMLSettings();
        return old;
    }


    // Publicize things.
    // require.Error = RequireError;
    // require.ArgumentsError = RequireArgumentsError;
    // define.Error = DefineError;
    // define.ArgumentCountError = DefineArgumentCountError;
    // define.InvalidModuleNameError = DefineInvalidModuleNameError;
    // define.InvalidModuleError = DefineInvalidModuleError;
    // define.DuplicateModuleError = DefineDuplicateModuleError;
    // define.functions = functions;
    // define._init = init;
    // define._modules = modules;
    // define._constructors = constructors;
    // window.define = define;
    // window.require = require;
    //
    // init(null, null, window);

    module.exports = define;

})();
