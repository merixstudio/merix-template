/*
 * Change placeholder for input value
 *
 * html structure:
 * <p class="placehodler-container">
 *     <label for="input" class="placeholder">
 *         Text
 *     </label>
 *     <input id="input" class="has-placeholder">
 * </p>
 * 
 * js:
 * find('.has-placeholder').placeholders();
 */
define('widgets/placeholder', ['jquery'], function(jQuery) {
    
    function Placeholder(element) {
        var self = this;
        this.element = element;
        this.placeholder = element.siblings('label.placeholder');

        if (typeof this.element.attr('id') === 'undefined')
            this.element.attr('id', 'placeholder' + new Date().getTime());
        this.id = this.element.attr('id');

        if (this.placeholder.length === 0)
            this.buildPlaceholder();

        this.element.removeAttr('placeholder');

        this.setPosition();
        
        this.element.focus(self.hidePlaceholder.bind(this)).blur(self.showPlaceholder.bind(this));
        
        // FF fix
        this.hidePlaceholder();
        this.showPlaceholder();
        
        jQuery(window).resize(self.setPosition.bind(this));
    }

    Placeholder.prototype.buildPlaceholder = function() {
        this.element.wrap('<span class="relative" style="display: inline-block; width: 100%; height: 100%" />');
        var placeholder = this.element.attr('placeholder');

        this.placeholder = jQuery('<label for="' + this.id + '" class="placeholder">' + placeholder + '</label>');

        this.element.before(this.placeholder);
    };
    
    Placeholder.prototype.setPosition = function() {
        var elementWidth = this.element.outerWidth();
        var elementHeight = this.element.outerHeight();
        this.placeholder.css({
            'width': elementWidth,
            'height': elementHeight
        });
    };
    
    Placeholder.prototype.hidePlaceholder = function() {
        this.placeholder.hide();
    };
    
    Placeholder.prototype.showPlaceholder = function() {
        if (!this.element.val())
            this.placeholder.show();
        
        if (this.element.hasClass('error'))
            this.placeholder.addClass('error');
        else
            this.placeholder.removeClass('error');
    };

    jQuery.fn.placeholders = function() {
        jQuery(this).each(function() {
            new Placeholder(jQuery(this));
        });
        return this;
    };

    return {
        'placeholder': Placeholder
    };

});