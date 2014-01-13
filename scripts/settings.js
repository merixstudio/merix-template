/*
 * Put global configuration options here.
 */
define('settings', {
    // Enable or disable jQuery 'no conflict' mode. Defaults to `true`.
    'JQUERY_NO_CONFLICT': true,

    'VIEWPORTS': {
        '320': [0, 479],
        '480': [480, 719],
        '720': [720, 959],
        '960': [960, 1279],
        '1280': [1280, 1599],
        '1600': [1600, 1919],
        '1920': [1920, Infinity],
    },

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
        //    // Additional classes that will be applied when width of parent is between given numbers.
        //    'small': [0, 299, 'self'],
        //    'medium': [300, 699, 'self'],
        //    'big': [700, Infinity, 'self'],
        //}
    }
});
