/*
 * Put global configuration options here.
 */
define('settings', {
    // Enable or disable jQuery 'no conflict' mode. Defaults to `true`.
    'JQUERY_NO_CONFLICT': true,

    // Some libraries use naming that is not compatible with our strict naming rules. Using the mapping below you
    // can make these libraries load properly under a new, compatible name.
    //'ALIASES': {
    //    'Phaser': 'phaser',
    //    'PIXI': 'pixi'
    //},

    'VIEWPORTS': {
        '320': [0, 479],
        '480': [480, 719],
        '720': [720, 959],
        '960': [960, 1279],
        '1280': [1280, 1599],
        '1600': [1600, 1919],
        '1920': [1920, Infinity]
    },
    // Uncomment this to disable 'viewport-portrait' and 'viewport-landscape' classes added automatically to body.
    // 'VIEWPORT_ORIENTATION_CLASS': false,

    'SMART_BLOCKS': {
        // Example smart block configuration.
        // Initial element selector.
        // '.block': {
        //     //Additional classes that will be applied when width of parent is between given numbers.
        //     'small': [0, 299],
        //     'medium': [300, 699],
        //     'big': [700, Infinity],
        // },
        // '.self-block': {
        //    // Additional classes that will be applied when width of element is between given numbers.
        //    'small': [0, 299, 'self'],
        //    'medium': [300, 699, 'self'],
        //    'big': [700, Infinity, 'self'],
        //}
    },
    
    'TRANSLATIONS': {
        'ENG': {
            'no_file': 'Click to select',
            'characters': 'characters',
            'hide': 'hide',
            'message_delete_confirm': 'Do you really want to delete this message?',
        }
    }
});
