define('jquery', ['settings'], function(settings) {
    /*
     * Adapter for the jQuery library. Place actual jQuery code in the /scripts/libs/ directory.
     */
    'use strict';
    if (settings('JQUERY_NO_CONFLICT'))
        jQuery.noConflict(true);
    return jQuery;
});
