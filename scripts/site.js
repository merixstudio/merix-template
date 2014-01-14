define('site', ['jquery', 'nebula/viewport', 'nebula/smart_blocks'], function(jQuery, viewport, smartBlocks) {
    'use strict';

    function Site() {
        viewport.enable();
        smartBlocks.enable();
        this.parseContent(document.body);
    }

    Site.prototype.parseContent = function(root) {
        function find(selector) {
            return jQuery(root).is(selector) ? jQuery(root) : jQuery(root).find('*').filter(selector);
        }

        smartBlocks.updateTree(root);
    };

    return Site;
});
