function get(v, d) {
    return typeof v != 'undefined' ? v : d;
}


function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}


jQuery.stopPropagation = function(e) {
    e.stopPropagation();
};


jQuery.preventDefault = function(e) {
    e.preventDefault();
};


jQuery.fn.hrefId = function() {
    var href = jQuery(this).attr('href');
    return href.substr(href.indexOf('#') + 1);
};


jQuery.fn.hrefTarget = function() {
    return jQuery('#' + jQuery(this).hrefId());
};


/*
 * Finds closest scrollable parent
 */
jQuery.fn.closestScrollable = function() {
    if (this.is('body'))
        return this;

    var overflowX = this.css('overflow-x');
    var overflowY = this.css('overflow-y');

    if (overflowX == 'scroll' || overflowX == 'auto')
        return this;

    if (overflowY == 'scroll' || overflowY == 'auto')
        return this;

    return this.parent().closestScrollable();
};


jQuery.fn.positionUntil = function(selector) {
    var result = {left: 0, top: 0};
    var element = this;

    while (element.length) {
        var position = element.position();
        result.left += position.left + element.scrollLeft();
        result.top += position.top + element.scrollTop();

        if (element.is(selector))
            break;

        element = element.offsetParent();
    }

    return result;
}


/*
 * Returns width of the vertical scrollbar in pixels.
 */
jQuery.getScrollbarWidth = function() {
    if (typeof this.scrollW == 'undefined') {
        // Calculate system scrollbar width using a placeholder element.
        var $placeholder = jQuery('<div style="position: absolute; visibility: hidden; overflow: scroll; width: 100px; height: 100px"/>').appendTo(document.body);

        this.scrollW = $placeholder.outerWidth() - $placeholder[0].scrollWidth;
        $placeholder.remove();
    }
    return this.scrollW;
};


jQuery.fn.optionsToChoices = function() {
    var choices = [];

    this.children().each(function() {
        var $this = jQuery(this);
        if ($this.is('option')) {
            var value = $this.attr('value');
            var label = $this.text();
            choices.push([value || '', label]);
        } else if ($this.is('optgroup'))
            choices.push([$this.attr('label'), $this.optionsToChoices()]);
    });

    return choices;
};
