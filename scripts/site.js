define('site', ['jquery'], function(jQuery) {

    function Site() {

    }

    Site.prototype.parseContent = function(root) {
        function finder(selector) {
            return jQuery(root).is(selector) ? jQuery(root) : jQuery(root).find('*').filter(selector);
        }

    };

    return Site;
});
