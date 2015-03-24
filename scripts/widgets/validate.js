/* ===================
 * Validation Script
 * Marcin Majewski, Marcin Wasilewski - Merix Studio
 * 
 * Avaible rules: required, email, phone, letters-only, postcode, equalto, number, min-length
 */
define('widgets/validate', ['jquery', 'translate'], function(jQuery, translate) {

    function Validate(form) {
        var self = this;
        this.form = form;
        this.formValid = new Array();

        this.checkFields();
    }

    Validate.prototype.checkFields = function() {
        var self = this;
        this.form.find('[data-validate]').each(function() {
            var field = jQuery(this);
            var validateData = JSON.parse(field.data('validate').replace(/\'/g, '"'));
            self.isRequired(field, validateData);
            self.isMail(field, validateData);
            self.isPhone(field, validateData);
            self.hasLettersOnly(field, validateData);
            self.isPostcode(field, validateData);
            self.isEqualTo(field, validateData);
            self.isNumber(field, validateData);
            self.isMinLength(field, validateData);
        });
    };

    Validate.prototype.isRequired = function(field, validateData) {
        if (field.prop('tagName') != 'SPAN') {
            if (validateData['required'] && field.is('[type="checkbox"]')) {
                if (field.is(':checked')) {
                    this.removeError(field);
                    this.formValid.push([true, field]);
                } else {
                    this.showError(field, 'required');
                    this.formValid.push([false, field]);
                }
            } else if (validateData['required'] && field.is('[type="radio"]')) {
                var i = 0;
                jQuery('[name="'+field.attr('name')+'"]').each(function() {
                    if (jQuery(this).is(':checked'))
                        i += 1;
                });

                if (i > 0) {
                    this.removeError(field);
                    this.formValid.push([true, field]);
                }
                else {
                    this.showError(field, 'required');
                    this.formValid.push([false, field]);
                }
            } else if (validateData['required'] && field.val() == '') {
                this.showError(field, 'required');
                this.formValid.push([false, field]);
            }
            else {
                this.removeError(field, 'required');
                this.formValid.push([true, field]);
            }
        }
    };

    Validate.prototype.isMail = function(field, validateData) {
        if (field.prop('tagName') != 'SPAN') {
            if (validateData['email']) {
                var regex = /^[-!#$%&'*+/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z{|}~])*@[a-zA-Z](-?[a-zA-Z0-9])*(\.[a-zA-Z](-?[a-zA-Z0-9])*)+$/; // regex '
                var email = field.val();
                if (regex.test(email)) {
                    this.removeError(field);
                    this.formValid.push([true, field]);
                } else {
                    this.showError(field, 'email');
                    this.formValid.push([false, field]);
                }
            }
        }
    };
    
    Validate.prototype.isPhone = function(field, validateData) {
        if (field.prop('tagName') != 'SPAN') {
            if (validateData['phone'] && field.val() != '') {
                var regex = /\(?([0-9.\+\-\s()]+)/;
                var phone = field.val();
                if (regex.test(phone)) {
                    this.removeError(field);
                    this.formValid.push([true, field]);
                } else {
                    this.showError(field, 'phone');
                    this.formValid.push([false, field]);
                }
            }
        }
    };
    
    Validate.prototype.hasLettersOnly = function(field, validateData) {
        if (field.prop('tagName') != 'SPAN') {
            if (validateData['letters-only'] && field.val() != '') {
                var regex = /^[^!@#\$%\^&\*\(\)\[\]:;'",\.\d+-]+$/;
                var name = field.val();
                if (regex.test(name)) {
                    this.removeError(field);
                    this.formValid.push([true, field]);
                } else {
                    this.showError(field, 'letters-only');
                    this.formValid.push([false, field]);
                }
            }
        }
    };
    
    Validate.prototype.isEqualTo = function(field, validateData) {
        if (field.prop('tagName') != 'SPAN') {
            if (validateData['equal-to'] && field.val() != '') {
                var equalTo = this.form.find('#'+ validateData['equal-to']);
                if (field.val() === equalTo.val()) {
                    this.removeError(field);
                    this.formValid.push([true, field]);
                    this.removeError(equalTo);
                } else {
                    this.showError(field, 'equal');
                    this.formValid.push([false, field]);
                    this.showError(equalTo, 'equal');
                }
            }
        }
    };
    
    Validate.prototype.isPostcode = function(field, validateData) {
        if (field.prop('tagName') != 'SPAN') {
            if (validateData['postcode'] && field.val() != '') {
                var regex = /^[0-9]{2}-[0-9]{3}$/;
                var postcode = field.val();
                if (regex.test(postcode)) {
                    this.removeError(field);
                    this.formValid.push([true, field]);
                } else {
                    this.showError(field, 'postcode');
                    this.formValid.push([false, field]);
                }
            }
        }
    };
    
    Validate.prototype.isNumber = function(field, validateData) {
        if (field.prop('tagName') != 'SPAN') {
            if (validateData['number'] && field.val() != '') {
                var regex = /^[0-9]*$/;
                var name = field.val();
                if (regex.test(name)) {
                    this.removeError(field);
                    this.formValid.push([true, field]);
                } else {
                    this.showError(field, 'number');
                    this.formValid.push([false, field]);
                }
            }
        }
    };
    
    Validate.prototype.isMinLength = function(field, validateData) {
        if (field.prop('tagName') != 'SPAN') {
            if (validateData['min-length'] && field.val() != '') {
                var name = field.val();
                if (name.length >= validateData['min-length']) {
                    this.removeError(field);
                    this.formValid.push([true, field]);
                } else {
                    this.showError(field, 'minlength', {0: validateData['min-length']});
                    this.formValid.push([false, field]);
                }
            }
        }
    };

    Validate.prototype.showError = function(element, type, errorVariables) {
        var multiple = false;
        var placeholder = element.siblings('.placeholder');
        var errorPlace = element.parent();
        errorVariables = errorVariables || null;
        
        if (element.is('[type="checkbox"]') || element.is('[type="radio"]')) {
            var elements = jQuery('[type="radio"][name="' + element.attr('name') + '"]');
            if (elements.length > 1) {
                multiple = true;
                if (!elements.last().hasClass('error'))
                    elements.last().addClass('error');
            } else {
                element.next('label').addClass('error');
            }
        }
        
        else if (placeholder.length)
            placeholder.closest('.placeholder-container').addClass('error');
        
        else if (element.parent().hasClass('scrollbar-offset')) {
            element.closest('.textarea-wrapper').addClass('error');
            errorPlace = element.closest('.textarea-wrapper').parent();
        }
        
        else if (element.prop('tagName') == 'SELECT') {
            element.closest('.fake-select').addClass('error');
            errorPlace = element.closest('.fake-select').parent();
        }
        
        else 
            element.parent().addClass('error');

        if (element.parent().children('.error-message').length == 0 && element.closest('.set').children('.error-message').length == 0) {
            if (multiple == false || (multiple == true && element.hasClass('error'))) {
                var validate = JSON.parse(element.data('validate').replace(/\'/g, '"'));
                var label = (typeof validate[type] == 'string' ? validate[type] : translate('validation_' + type, errorVariables));
                
                if (element.prop('tagName') == 'SELECT') {
                    if (element.parent().nextAll('.error-message').length == 0)
                        errorPlace.append('<p class="error-message">' + label + '</p>');
                } else {
                    errorPlace.append('<p class="error-message">' + label + '</p>');
                }
            }
        }
    };

    Validate.prototype.removeError = function(element) {
        var placeholder = element.siblings('.placeholder');
        
        if (element.is('[type="checkbox"]') || element.is('[type="radio"]'))
            element.next('label').removeClass('error');
        
        else if (placeholder.length)
            placeholder.closest('.placeholder-container').removeClass('error');
        
        else if (element.hasClass('scrollable'))
            element.closest('.scrollbar-wrapper').removeClass('error');
        
        else if (element.parent().hasClass('scrollbar-offset'))
            element.closest('.textarea-wrapper').removeClass('error');
        
        else if (element.prop('tagName') == 'SELECT') {
            element.closest('.fake-select').removeClass('error');
            element.closest('.fake-select').nextAll('.error-message').remove();
        }
        
        else 
            element.parent().removeClass('error');
        
        element.nextAll('.error-message').remove();
    };

    Validate.prototype.isValid = function() {
        for(var i = 0; i < this.formValid.length; i++) {
            if (this.formValid[i][0] == false) {
                this.scrollToError(this.formValid[i][1]);
                return false;
                break;
            }
        }

        return true;
    };
    
    Validate.prototype.scrollToError = function(field) {
        var sectionOffset = Math.ceil(field.offset().top);
        var scrollTo = sectionOffset - 50;

        jQuery('body, html').stop().animate({'scrollTop': scrollTo}, 500);

        field.focus();
    };

    jQuery.fn.validate = function(){
        jQuery(this).each(function() {
            var form = jQuery(this);
            var button = form.find('button');
            var body = form.closest('.page-wrap');
            form.attr('novalidate', 'novalidate');
            form.on('submit', function(event) {
                    event.preventDefault(); ///DELETE
                var valid = new Validate(form);

                if (valid.isValid() != true)
                    event.preventDefault();
            });
        });

        return this;
    };

    return Validate;
});