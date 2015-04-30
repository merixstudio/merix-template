define('hover_tap', ['jquery', 'detect'], function(jQuery, detect) {
    'use strict';

    function HoverTap(element) {
        if (!detect.touch) {
            element.on('mouseenter', function() {
                element.addClass('hover');
            });
            element.on('mouseleave', function() {
                element.removeClass('hover');
            });
        } else {
            element.on('click', function(event) {
                event.preventDefault();
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
    jQuery.fn.hoverTap = function() {
        return this.each(function() {
            new HoverTap(jQuery(this));
        });
    };

    return HoverTap;
});
