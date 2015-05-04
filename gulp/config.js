module.exports = {

    'serverport': 1337,

    'styles': {
        'src' : 'styles/**/*.scss',
        'dest': '_build/styles'
    },

    'scripts': {
        'src' : 'scripts/**/*.js',
        'dest': '_build/scripts'
    },

    'fonts': {
        'src' : 'fonts/**/*',
        'dest': '_build/fonts'
    },

    'images': {
        'src' : 'images/**/*',
        'dest': '_build/images'
    },

    'medias': {
        'src' : 'media/**/*',
        'dest': '_build/media'
    },

    'views': {
        'watch': 'templates/**/*.html',
        'src': ['templates/**/*.html', '!templates/{macros,macros/**,elements,elements/**,layouts,layouts/**}'],
        'dest': '_build'
    },

    'dist': {
        'root'  : '_build'
    },

    'browserify': {
        'entries'   : './scripts/site.js',
        'bundleName': 'main.js'
    }

};
