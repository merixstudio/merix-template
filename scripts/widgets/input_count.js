var jQuery = require('jquery');
var translate = require('../utilities/translate');

jQuery.fn.inputCount = function(counter, count) {
    var length = [];

    jQuery(this).each(function(index) {
        var element = jQuery(this);
        element.bind('input', function() {

            length[index] = count - element.val().length;

            if (length[index] < 0)
                length[index] = 0;

            if (element.siblings(counter).length > 0)
                output = element.siblings(counter);
            else if (element.parents('.textarea-wrapper').next(counter).length > 0)
                output = element.parents('.textarea-wrapper').next(counter);
            else
                output = jQuery(counter);


            return output.text(length[index] + ' ' + translate('characters'));
        });
    });
};
