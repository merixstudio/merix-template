/*
 * Change placeholder for input value
 *
 * exceptions = Array('class1', 'class2')
 */
define('widgets/placeholder', ['jquery'], function(jQuery) {
    function placeholders(element, exceptions) {
        var replacePlaceholder = true;
        if (element.attr('class') !== undefined) {
            var classNames = element.attr('class').split(' ');

            jQuery.each(classNames, function(index, item) {
                if (jQuery.inArray(item, exceptions) == 0) {
                    replacePlaceholder = false;
                }
            });
        }

        if (replacePlaceholder == true) {
            element.attr('data-placeholder', element.attr('placeholder')).removeAttr('placeholder');

            if (element.val().length == 0) {
                element.addClass('placeholder').val(element.data('placeholder'));
            }

            element.focus(function() {
                if (element.val() == element.data('placeholder')) {
                    element.val('').removeClass('placeholder');
                }
            }).blur(function() {
                if (element.val().length == 0) {
                    element.val(element.data('placeholder')).addClass('placeholder');
                }
            });
        }
    }

    jQuery.fn.placeholders = function(exceptions) {
        jQuery(this).each(function() {
            placeholders(jQuery(this), exceptions);
        });
        return this;
    };

    return {
        'placeholders': placeholders
    };

});