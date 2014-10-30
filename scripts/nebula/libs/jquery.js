define('jquery', ['settings'], function(settings) {
    /*
     * Adapter for the jQuery library. Place actual jQuery code in the /scripts/libs/ directory.
     */
    'use strict';
    var jQuery = window.jQuery;
    if (typeof jQuery === 'undefined')
        throw new Error('The jQuery library was not loaded.');
    if (settings('JQUERY_NO_CONFLICT'))
        jQuery.noConflict(true);
    return jQuery;
});
