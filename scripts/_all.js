/*
 * Shortcut for managing many files. Please don't use this file on a live site due to performance implications.
 * Instead merge the files below to a single JavaScript file manually or using your backend technology.
 */
(function() {
    var paths = [
        'scripts/jquery.js',
        'scripts/base.js',
        'scripts/main.js'
    ];

    function load() {
        if (paths.length == 0)
            return;

        var script = document.createElement('script');
        script.src = paths.shift();
        script.onreadystatechange = load;
        script.onload = load;
        document.body.appendChild(script);
    }

    load();
})();
