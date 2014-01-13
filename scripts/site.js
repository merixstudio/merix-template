define('site', ['jquery', 'viewport', 'smart_blocks'], function(jQuery, viewport, smartBlocks) {

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
