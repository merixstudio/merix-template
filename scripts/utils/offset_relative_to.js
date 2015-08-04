/*
 * Returns offset relative to parent's element offset.
 */
var jQuery = require('jquery');
return jQuery.fn.offsetRelativeTo = function(parent, addScroll) {
    parent = jQuery(parent);

    if (typeof addScroll == 'undefined')
        addScroll = false;

    var elementOffset = this.offset();
    var parentOffset = parent.offset();

    if (parentOffset) {
        elementOffset.top -= parentOffset.top;
        elementOffset.left -= parentOffset.left;
    }

    if (addScroll) {
        var scrollTop = parent.scrollTop();
        var scrollLeft = parent.scrollLeft();

        if (parent.is(document.body)) {
            scrollTop = 0;
            scrollLeft = 0;
        }

        if (parent.is(jQuery(window))) {
            scrollTop = -scrollTop;
            scrollLeft = -scrollLeft;
        }

        elementOffset.top += scrollTop;
        elementOffset.left += scrollLeft;
    }

    return elementOffset;
};
