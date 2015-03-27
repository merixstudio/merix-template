var jQuery = require('jquery');
var safeOn = require('../safe_on');

function Handle(element) {
    this.element = element;
    this.scrollPane = this.element.parent();

    this.size = 0;

    this.position = {
        current: 0,
        max: 0,
        temporary: 0
    };

    this.mouse = {
        start: 0,
        current: 0
    };

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onScrollPaneMouseDown = this.onScrollPaneMouseDown.bind(this);

    this.element.on('mousedown', this.onMouseDown);
    this.scrollPane.on('mousedown', this.onScrollPaneMouseDown);
}

Handle.prototype.getScrollPaneSize = function() {
    return this.scrollPane.outerHeight();
};

Handle.prototype.getMouseEventPosition = function(event) {
    return event.pageY;
};

Handle.prototype.getMouseRelativePosition = function() {
    return this.mouse.current - this.scrollPane.offset().top;
};

Handle.prototype.setPosition = function(progress) {
    this.position.current = (this.getScrollPaneSize() - this.size) * progress;
};

Handle.prototype.setSize = function(ratio) {
    this.size = this.getScrollPaneSize() * (1 - ratio);
    this.position.max = this.getScrollPaneSize() - this.size;
};

Handle.prototype.render = function() {
    this.element.css('height', Math.round(this.size)+10);
    this.element.css('top', Math.round(this.position.current));
};

Handle.prototype.onMouseDown = function(event) {
    event.preventDefault();

    this.mouse.start = this.getMouseEventPosition(event);
    this.mouse.current = this.getMouseEventPosition(event);
    this.position.temporary = this.position.current;

    jQuery(document).on('mousemove', this.onMouseMove);
    jQuery(document).one('mouseup', this.onMouseUp);
};

Handle.prototype.onScrollPaneMouseDown = function(event) {
    event.preventDefault();

    this.mouse.start = this.getMouseEventPosition(event);
    this.mouse.current = this.getMouseEventPosition(event);
    this.position.temporary = this.position.current;

    var mousePosition = this.getMouseRelativePosition();

    if (mousePosition < this.position.current)
        this.position.current = mousePosition;
    else if (mousePosition > this.position.current + this.size)
        this.position.current = mousePosition - this.size;

    jQuery(this).trigger('drag', this.position.current / this.position.max);
};

Handle.prototype.onMouseMove = function(event) {
    this.mouse.current = this.getMouseEventPosition(event);
    this.position.current = Math.max(0, Math.min(this.position.temporary + (this.mouse.current - this.mouse.start), this.position.max));

    jQuery(this).trigger('drag', this.position.current / this.position.max);
};

Handle.prototype.onMouseUp = function(event) {
    jQuery(document).off('mousemove', this.onMouseMove);
};



function Scrollbar(element) {
    this.element = element;

    if (!this.element.closest('.scrollbar-wrapper').length)
        this.element.wrap('<div class="scrollbar-wrapper"/>');

    if (!this.element.closest('.scrollbar-clip').length)
        this.element.wrap('<div class="scrollbar-clip"/>');

    if (!this.element.closest('.scrollbar-offset').length)
        this.element.wrap('<div class="scrollbar-offset"/>');

    this.wrapper = this.element.closest('.scrollbar-wrapper');

    this.offset = this.element.closest('.scrollbar-offset');
    this.offset.css('margin-right', -Scrollbar.width);
    //this.offset.css('margin-bottom', -Scrollbar.width);

    this.position = {
        current: 0,
        max: 0
    };

    this.handle = null;

    this.onScroll = this.onScroll.bind(this);
    this.onHandleDrag = this.onHandleDrag.bind(this);

    this.element.on('scroll', this.onScroll);
    this.element.on('keypress keyup blur', this.onScroll);
    jQuery(window).on('resize', safeOn(this.element, this.update.bind(this)));
}

Scrollbar.width = 0;

Scrollbar.prototype.getCurrentScrollPosition = function() {
    return this.element.scrollTop();
};

Scrollbar.prototype.setCurrentScrollPosition = function(position) {
    this.element.scrollTop(position);
};

Scrollbar.prototype.getMaxScrollPosition = function() {
    return Math.max(0, this.element[0].scrollHeight - this.element.outerHeight() + Scrollbar.width);
};

Scrollbar.prototype.getElementSize = function() {
    return this.element[0].scrollHeight;
};

Scrollbar.prototype.attachScrollPane = function(target) {
    this.handle = new Handle(jQuery('<div class="handle"/>').appendTo(jQuery('<div class="scrollbar"/>').appendTo(target)));
    jQuery(this.handle).on('drag', this.onHandleDrag);
};

Scrollbar.prototype.updateHandle = function() {
    this.handle.setSize(this.position.max / this.getElementSize());
    this.handle.setPosition(this.position.current / this.position.max);
    this.handle.render();
};

Scrollbar.prototype.update = function() {
    this.position.current = this.getCurrentScrollPosition();
    this.position.max = this.getMaxScrollPosition();

    this.updateHandle();

    if (this.position.max === Scrollbar.width && this.handle)
        this.handle.scrollPane.addClass('hidden');
    else
        this.handle.scrollPane.removeClass('hidden');

};

Scrollbar.prototype.onHandleDrag = function(event, ratio) {
    this.position.current = this.position.max * ratio;
    this.setCurrentScrollPosition(this.position.current);
};

Scrollbar.prototype.onScroll = function() {
    this.update();
};


/*
 * Measure width of system scrollbar
 */
(function() {
    var placeholder = jQuery('<div style="position: absolute; visibility: hidden; overflow: scroll; width: 100px; height: 100px"/>').appendTo(document.body);
    Scrollbar.width = placeholder.outerWidth() - placeholder[0].scrollWidth || 15;
    placeholder.remove();
})();


/*
 * jQuery plugin
 */
jQuery.fn.scrollbar = function() {
    return this.each(function() {
        var scrollbar = new Scrollbar(jQuery(this));
        jQuery(this).closest('.scrollbar-wrapper').find('.handle').css('height', '0');
        scrollbar.attachScrollPane(jQuery(this).closest('.scrollbar-wrapper'));
        scrollbar.update();
    });
};

module.exports = Scrollbar;
