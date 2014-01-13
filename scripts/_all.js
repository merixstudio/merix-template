/*
 * Shortcut for managing many files. Please don't use this file on a live site due to performance implications.
 * Instead merge the files below to a single JavaScript file manually or using your backend technology.
 */
(function() {
    var paths = [
        'scripts/polyfills.js',
        'scripts/require.js',
        'scripts/settings.js',
        'scripts/signal.js',
        'scripts/jquery.js',
        'scripts/viewport.js',
        'scripts/smart_blocks.js',
        'scripts/site.js',
        'scripts/main.js'
    ];

    document.write('<script src="' + paths.join('"></script><script src="') + '"></script>');
})();
