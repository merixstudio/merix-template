/*
 * Shortcut for managing many files. Please don't use this file on a live site due to performance implications.
 * Instead merge the files below to a single JavaScript file manually or using your backend technology.
 */
(function() {
    var paths = [
        'scripts/require.js',
        'scripts/jquery.js',
        'scripts/main.js'
    ];

    for (var i = 0; i < paths.length; i++)
        document.write('<script src="' + paths[i] + '"></script>');
})();
