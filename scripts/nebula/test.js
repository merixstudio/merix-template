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

        if ('_settings' in define.modules)
            settings = define.modules._settings;
        else
            settings = define.modules._settings = {};

        for (name in newSettings) {
            if (name in settings)
                backup[name] = settings[name];
            settings[name] = newSettings[name];
        }

        result = callback(require('settings'));

        // Restore previous settings.
        for (name in backup)
            settings[name] = backup[name];
        return result;
    }

    return {
        'overrideSettings': overrideSettings
    }
});
