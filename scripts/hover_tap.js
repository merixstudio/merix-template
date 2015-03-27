'use strict';
var jQuery = require('jquery');
var detect = require('./detect');
function HoverTap(element) {
    if (!detect.touch) {
        element.on('mouseenter', function() {
            element.addClass('hover');
        });
        element.on('mouseleave', function() {
            element.removeClass('hover');
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
jQuery.fn.hoverTap = function() {
    return this.each(function() {
        new HoverTap(jQuery(this));
    });
};

module.exports = HoverTap;
