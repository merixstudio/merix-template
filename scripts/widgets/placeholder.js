/*
 * Change placeholder for input value
 *
 * html structure:
 * <p class="placehodler-container">
 *     <label for="input" class="placeholder">
 *         Text
 *     </label>
 *     <input id="input" placeholder="text">
 * </p>
 * 
 * js:
 * find('[placeholder]').placeholders();
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
        
        this.element.on('focus hidePlaceholder', self.hidePlaceholder.bind(this)).on('blur showPlaceholder', self.showPlaceholder.bind(this));
        this.element.change(function() {
            self.hidePlaceholder();
            self.showPlaceholder();
        });

        // FF fix
        this.element.trigger('hidePlaceholder');
        this.element.trigger('showPlaceholder');
        
        // Chrome autofill fix
        setTimeout(function() {
            self.hidePlaceholder();
            self.showPlaceholder();
        }, 500);

        this.element.on('setPosition', this.setPosition.bind(this));

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
            'position': 'absolute',
            'top': 0,
            'left': 0,
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