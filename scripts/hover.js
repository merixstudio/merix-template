define('hover2', ['jquery', 'detect'], function(jQuery, detect) {
    'use strict';

    function Hover(element) {
        console.log(element);
        if (detect.device.desktop) {
            element.on('mouseenter', function() {
                element.addClass('hover')
            });
            element.on('mouseleave', function() {
                element.removeClass('hover')
            });
        } else {
            element.on('click', function() {
                if (!element.hasClass('hover')) {
                    element.addClass('hover');
                } else {
                    element.removeClass('hover');
                }
            });
        }
    }
    
    /*
     * jQuery plugin
     */
    jQuery.fn.hover2 = function() {
        return this.each(function() {
            new Hover(jQuery(this));
        });
    };

    return Hover;
});
