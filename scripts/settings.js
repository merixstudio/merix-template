/*
 * Put global configuration options here. None are required at the moment.
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
        '1600': [1600, Infinity],
        'portrait': '(orientation: portrait)',
        'landscape': '(orientation: landscape)'
    }
});
