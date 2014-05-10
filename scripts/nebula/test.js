/*
 * Some unit testing helpers.
 */
define('nebula/test', function() {
    'use strict';


    function overrideSettings(newSettings, callback) {
        /*
         * Allows to override global settings, to help unit testing setting-dependent code.
         * Settings are overriden only for the time needed to execute provided callback and then old values
         * are restored.
         */
        var name, backup = {}, settings, result;

        if ('_settings' in define._modules)
            settings = define._modules._settings;
        else
            settings = define._modules._settings = {};

        for (name in newSettings) {
            backup[name] = settings[name];
            settings[name] = newSettings[name];
        }

        result = callback(require('settings'));

        // Restore previous settings.
        for (name in backup)
            settings[name] = backup[name];
        return result;
    }


    function overrideModules(modules, callback) {
        var backup = {}, name;

        for (name in modules) {
            backup[name] = define._modules[name];
            define._modules[name] = modules[name];
        }

        var result = callback();

        for (name in backup)
            define._modules[name] = backup[name];
        return result;
    }


    return {
        'overrideSettings': overrideSettings,
        'overrideModules': overrideModules
    };
});
