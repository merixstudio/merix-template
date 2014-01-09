define('site', ['jquery', 'viewport'], function(jQuery, viewport) {
    'use strict';

    function Site() {
        this.parseContent(document.body);
        viewport.enable();
    }

    Site.prototype.parseContent = function(root) {
        function find(selector) {
            return jQuery(root).is(selector) ? jQuery(root) : jQuery(root).find('*').filter(selector);
        }
    };

    return Site;
});
