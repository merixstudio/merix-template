define('site', ['jquery'], function(jQuery) {
    'use strict';

    function Site() {
        this.parseContent(document.body);
    }

    Site.prototype.parseContent = function(root) {
        function find(selector) {
            return jQuery(root).is(selector) ? jQuery(root) : jQuery(root).find('*').filter(selector);
        }
    };

    return Site;
});
