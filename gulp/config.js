const config = {
    'serverport': 1337,

    'styles': {
        'src' : 'styles/**/*.scss',
        'dest': '_build/styles'
    },

    'scripts': {
        'src' : 'scripts/**/*.js',
        'dest': '_build/scripts'
    },

    'polyfills': {
        'src' : 'scripts/polyfills/**/*.js',
        'dest': '_build/scripts/polyfills'
    },

    'fonts': {
        'src' : 'fonts/**/*',
        'dest': '_build/fonts'
    },

    'icons': {
        'enable': true,
        'zip' : 'fonts/icons.zip',
        'replace': {
            'from': 'fonts/',
            'to': '../fonts/'
        },
        'files' : {
            'selection.json'  : './fonts',
            'fonts/icons.ttf' : './fonts',
            'fonts/icons.woff': './fonts',
            'fonts/icons.eot' : './fonts',
            'fonts/icons.svg' : './fonts',
            'style.css'       : './styles/base',
        }
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
        'src': ['templates/**/*.html', '!templates/{macros,macros/**,partials,partials/**,layouts,layouts/**}'],
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

export default config
