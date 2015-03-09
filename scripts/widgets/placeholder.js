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
        this._buildPlaceholder();
        this.placeholder = element.siblings('label.placeholder');
        
        this.setPosition();
        
        this.element.focus(self.hidePlaceholder.bind(this)).blur(self.showPlaceholder.bind(this));
        
        // FF fix
        this.hidePlaceholder();
        this.showPlaceholder();
        
        jQuery(window).resize(self.setPosition.bind(this));
    }
    
    Placeholder.prototype._buildPlaceholder = function() {
        var container = this.element.parent();
        var placeholder = container.find('.placeholder');
        
        if (placeholder.length === 0)
            container.append('<label for="'+ this.element.attr('id') +'" class="placeholder"/>');
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