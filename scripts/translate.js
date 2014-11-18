define('translate', ['jquery', 'settings'], function(jQuery, settings) {
    'use strict';

    function translate(key) {
        var language = settings('LANGUAGE');
        var translation = settings('TRANSLATIONS')[language][key];

        if(translation == undefined) {
            translation = settings('TRANSLATIONS')['ENG'][key];

            if(translation == undefined) {
                console.error('Can\'t find key "' + key + '" in translate array');
                return '';
            } else
                console.warn('Can\'t find key "' + key + '" in "' + language + '" translate array');
        }

        return translation;

    }

    return translate;

});
