'use strict';
var settings = require('./settings');
function translate(key, variables) {
    var translation;
    // var language = settings['LANGUAGE'];

    if (typeof settings[key] != 'undefined')
        translation = settings[key];
    else
        translation = settings['TRANSLATIONS'][language][key];

    return translation.replace(/{(\d+)}/g, function(match, number) {
        return typeof variables[number] != 'undefined' ? variables[number] : match;
    });
}

module.exports = translate;
