/*
 * Finds closest scrollable parent
 */

var jQuery = require('jquery');
var defaults = {
    horizontal: true,
    vertical: true
};

jQuery.fn.firstScrollableElement = function(options) {
    options = jQuery.extend({}, defaults, options);

    var result = jQuery();

    this.each(function() {
        var element = jQuery(this);

        if (options.vertical && element.scrollTop() > 0)
            return !(result = element);

        if (options.horizontal && element.scrollLeft() > 0)
            return !(result = element);

        if (options.vertical) {
            element.scrollTop(1);
            var isScrollable = element.scrollTop() > 0;
            element.scrollTop(0);
            if (isScrollable)
                return !(result = element);
        }

        if (options.horizontal) {
            element.scrollLeft(1);
            var isScrollable = element.scrollLeft() > 0;
            element.scrollLeft(0);
            if (isScrollable)
                return !(result = element);
        }
    });

    return result;
}

return jQuery.fn.closestScrollable = function(options) {
    if (this.is('body')) {
        var first = jQuery('html, body').firstScrollableElement(options);
        if (!first.length)
            first = jQuery(window);
        return first;
    }

    // Filter out select tags which could be scrollable (multiple choices)
    if (this.is('select'))
        return this.parent().closestScrollable();

    var overflowX = this.css('overflow-x');
    var overflowY = this.css('overflow-y');

    if (overflowX == 'scroll' || overflowX == 'auto')
        return this;

    if (overflowY == 'scroll' || overflowY == 'auto')
        return this;

    return this.parent().closestScrollable();
};
