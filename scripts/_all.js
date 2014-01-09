/*
 * Shortcut for managing many files. Please don't use this file on a live site due to performance implications.
 * Instead merge the files below to a single JavaScript file manually or using your backend technology.
 */
(function() {
    'use strict';

    var paths = [
        'scripts/polyfills.js',  // IE8 support, skip or remove if targeting IE9+.
        'scripts/require.js',
        'scripts/settings.js',
        'scripts/signal.js',
        'scripts/jquery.js',
        'scripts/viewport.js',
        'scripts/site.js',
        'scripts/main.js'
    ];

    document.write('<script src="' + paths.join('"></script>\n<script src="') + '"></script>');
})();
