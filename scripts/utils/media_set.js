/*
 * Responsive images
 */

module.exports = function() {
    var jQuery = require('jquery');
    var imageLoader = require('./image_loader');
    var throttle = require('./throttle');
    var safeOn = require('./safe_on');
    var script = jQuery(this);
    var contents = jQuery(jQuery.trim(script.text() || script.html()));
    var element = null, oldElement = null;

    if (typeof window.matchMedia !== 'undefined') {
        function selectElement() {
            element = oldElement;

            contents.each(function() {
                if (matchMedia(jQuery(this).attr('media')).matches || typeof jQuery(this).attr('data-media-fallback') !== 'undefined') {
                    element = jQuery(this);
                    return false;
                }
            });

            if (element !== oldElement) {
                if (oldElement)
                    oldElement.detach();
                if (element) {
                    element.insertAfter(script);
                    if (element.is('img'))
                        element.each(imageLoader);
                }
            }

            oldElement = element;
        };

        selectElement();
        jQuery(window).on('resize', safeOn(script, throttle(null, 250, selectElement)));
    } else
        contents.last().insertAfter(script).each(imageLoader);
};
