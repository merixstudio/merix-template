/*
 * Custom File Input
 */
jQuery.fn.customFileInput = function(options) {
    options = get(options, {});

    return this.each(function() {
        var $file = jQuery(this).css('opacity', 0);
        var $inputParent = $file.parent();
        $file.wrap('<span class="' + get(options.wrapperClass, 'file-input') + '"/>');
        var $wrapper = $file.parentsUntil($inputParent).last().addClass($file.attr('class'));
        var $input = jQuery('<span class="' + get(options.inputClass, 'file-input-value') + '"><span><span/></span></span>').insertBefore($file).find('span').last();
        var $button = jQuery('<a class="button ' + get(options.buttonClass, 'file-input-button') + '">' + get(options.buttonText, 'Browse') + '</a>').insertBefore($file);

        function update() {
            $input.text($file.val());
            $wrapper.toggleClass('file-selected', $file.val() != '');
        }

        $file.bind('change keypress keydown keyup', update);

        update();

        $file.focus(function() {
            $wrapper.addClass('focus');
        }).blur(function() {
            $wrapper.removeClass('focus');
        });

        $input.parent().parent().click(function() {
           $file.focus().click();
        });

        $button.click(function() {
           $file.focus().click();
        });
    });
};


/*
 * Custom, fully styleable select fields.
 */
function SelectField($select, options) {
    options = get(options, {});
    var self = this;
    this.$select = $select;
    this.$fake = jQuery(SelectField.fakeHTML).addClass(this.$select.attr('class')).insertAfter(this.$select);
    this.$fakeDropdown = null;
    this.mode = get(options.mode, SelectField.MODE_DEFAULT);
    this._closeFlag = false;

    this._showEvent = function() {
        if (!this.$fakeDropdown)
            self._showDropdown();
    };
    this._hideEvent = function(e) {
        self._hideDropdown();
    };
    this._updateEvent = function(e) {
        self._updateFake();
    };
    this._submitEvent = function(e) {
        if (self.$fakeDropdown) {
            self._updateFake();
            self._hideDropdown();
        }
    };
    this._keyEvent = function(e) {
        if (e.keyCode == 13 && self.$fakeDropdown) {
            self._updateFake();
            self._hideDropdown();
            return false;
        }
        if (e.keyCode == 32 && !self.$fakeDropdown) {
            self._showDropdown();
            return false;
        }
    };
    this._selectEvent = function(e) {
        e.preventDefault();
        e.stopPropagation();
        var value = jQuery(this).find(':hidden').val();
        var $option = self.$select.find('option[value="' + value + '"]');
        if (!$option.length)
            self.$select.find('option').each(function() {
                if (value == jQuery(this).text()) {
                    $option = jQuery(this);
                    return false;
                }
            });
        $option.attr('selected', 'selected');
        self.$select.change();
        self._hideDropdown();
        self._updateFake();
    };

    this.$select.mousedown(false);
    this.$select.focus(this._showEvent).blur(this._hideEvent);
    this.$select.bind('change keypress keydown keyup', this._updateEvent);
    this.$select.closest('form').submit(this._submitEvent);
    this.$select.keydown(this._keyEvent);

    this.$fake.mousedown(function(e) {
        e.preventDefault();

        if (self.$fakeDropdown)
            self._closeFlag = true;
    }).mouseup(function() {
        if (!self._closeFlag)
            self.$select.focus();
        else
            self._closeFlag = false;
    });

    jQuery(window).resize(function() {
        self._hideDropdown();
    });

    jQuery(function() {
        self._updateFake();
        self.$fake.css('min-width', self.$select.outerWidth() + 'px');
        self.$select.css({'position': 'absolute', 'opacity': 0}).attr('size', 2);
    });
}

SelectField.MODE_DEFAULT = 0;
SelectField.MODE_OVERLAP = 1;

SelectField.fakeHTML = '<span class="fake-select"><span><span class="value"/></span></span>';

SelectField.fakeDropdownItemHTML = function(value, label, initial) {
    var classes = '';
    if (value == '')
        classes += ' default';
    if (initial == value)
        classes += ' selected';
    if (classes)
        classes = ' class="' + classes + '"';
    return '<li><a href="#"' + classes + '><input type="hidden" value="' + escapeHtml(value || label) + '"> ' + escapeHtml(label) + '</a></li>';
};

SelectField.fakeDropdownHTML = function(choices, initial, nested) {
    var html = '<ul>';
    for (var i = 0; i < choices.length; i++) {
        var value = choices[i][0];
        var label = choices[i][1];

        if (typeof label == 'string')
            html += SelectField.fakeDropdownItemHTML(value || '', label, initial);
        else
            html += '<li><label>' + value + '</label>' + SelectField.fakeDropdownHTML(label, initial, true) + '</li>';
    }

    html += '</ul>';
    if (!nested)
        html = '<div class="fake-dropdown">' + html + '</div>';
    return html;
};

SelectField.prototype._updateFake = function() {
    var rawValue = this.$select.find(':selected').val();
    this.$fake.toggleClass('default', rawValue == '');

    this.$fake.find('.value').text(this.$select.find(':selected').text());
    if (this.$fakeDropdown)
        this.$fakeDropdown.find('a').removeClass('selected').find(
            'input[value="' + this.$select.val() + '"]').closest('a').addClass('selected');
};

SelectField.prototype._showDropdown = function() {
    this.$fake.stop(true).css('opacity', 1);
    var scrollableParent = this.$select.closestScrollable();

    if (!this.$fakeDropdown) {
        var choices = this.$select.optionsToChoices();
        this.$fakeDropdown = jQuery(SelectField.fakeDropdownHTML(choices, this.$select.val()));
        this.$fakeDropdown.show().addClass(this.$select.attr('class'));
        this.$fakeDropdown.mousedown(false);
        this.$fakeDropdown.find('a').click(false).mousedown(this._selectEvent);
        jQuery(document).one('mousedown', this._hideEvent);
    }

    var offset = this.$fake.positionUntil(scrollableParent);
    var y = Math.round(offset.top);
    if (this.mode == SelectField.MODE_DEFAULT)
        y += this.$fake.outerHeight();
    else if (this.mode == SelectField.MODE_OVERLAP)
        this.$fake.stop(true).animate({'opacity': 0}, 1000);

    var x = offset.left;
    if (x > jQuery(window).width() - this.$fakeDropdown.outerWidth())
        x += this.$fake.outerWidth() - this.$fakeDropdown.outerWidth();

    this.$fakeDropdown.children('ul').scrollbar();

    this.$fakeDropdown.css({
        'min-width': this.$fake.outerWidth() + 'px', 'opacity': 0,
        'left': x + 'px', 'top': y + 'px'}).animate({'opacity': 1}, 250).appendTo(scrollableParent);

};

SelectField.prototype._hideDropdown = function() {
    if (this.$fakeDropdown) {
        this.$fakeDropdown.stop(true).animate({'opacity': 0}, 500, function() {
            jQuery(this).remove();
        });
        this.$fakeDropdown = null;
        if (this.mode == SelectField.MODE_OVERLAP)
            this.$fake.stop(true).css('opacity', 1);
        jQuery(document).unbind('mousedown', this._hideEvent);
    }
};

jQuery.fn.selectField = function(options) {
    return this.each(function() {
        new SelectField(jQuery(this), options);
    });
};


/*
 * Allows styling of checkboxes by creating additional element after
 * given checkbox.
 */
function CheckboxField(input) {
    var self = this;
    this.$input = jQuery(input).css({'position': 'absolute', 'left': '-99em'});
    this.$fake = jQuery(CheckboxField.fakeHTML).addClass(this.$input.attr('class')).insertBefore(this.$input);

    this._focusEvent = function() {
        self.hasFocus = true;
        self._updateHTML(false, true);
        jQuery(self).trigger('focus');
    };

    this._blurEvent = function() {
        self.hasFocus = false;
        self._updateHTML(false, true);
        jQuery(self).trigger('blur');
    };

    this._changeEvent = function() {
        self.isChecked = self.$input.is(':checked');
        self._updateHTML(false, true);
        jQuery(self).trigger('change');
    };

    this._loadEvent = function() {
        self.hasFocus = self.$input.is(':focus');
        self.isChecked = self.$input.is(':checked');
        self.isDisabled = self.$input.is(':disabled');
        self._updateHTML(false, true);
    };

    this.$input.focus(this._focusEvent).blur(this._blurEvent);
    this.$input.change(this._changeEvent);
    this.$input.closest('form').bind('reset', this._changeEvent);
    this.$fake.mousedown(jQuery.preventDefault);
    jQuery(this._loadEvent);
}

CheckboxField._instances = [];

CheckboxField.create = function(input) {
    for (var i = 0; i < CheckboxField._instances.length; i++)
        if (CheckboxField._instances[i].$input[0] == input)
            return CheckboxField._instances[i];

    var checkbox = new CheckboxField(input);
    CheckboxField._instances.push(checkbox);
    return checkbox;
};

CheckboxField.fakeHTML = '<span class="fake-checkbox"/>';

CheckboxField.prototype.disable = function() {
    this.isDisabled = true;
    this._updateHTML(true, true);
};

CheckboxField.prototype.enable = function() {
    this.isDisabled = false;
    this._updateHTML(true, true);
};

CheckboxField.prototype.check = function() {
    this.isChecked = true;
    this._updateHTML(true, true);
};

CheckboxField.prototype.enable = function() {
    this.isChecked = false;
    this._updateHTML(true, true);
};

CheckboxField.prototype._updateHTML = function(updateInput, updateFake) {
    if (updateInput) {
        this.$input.attr('disabled', this.isDisabled);
        if (this.isChecked)
            this.$input.attr('checked', true);
        else
            this.$input.removeAttr('checked');
    }
    if (updateFake) {
        this.$fake.toggleClass('checked', this.isChecked)
        this.$fake.toggleClass('disabled', this.isDisabled);
        this.$fake.toggleClass('focus', this.hasFocus);
    }

    this.$input.closest('label').toggleClass('checked', this.isChecked)
};

jQuery.fn.checkboxField = function() {
    return this.each(function() {
        CheckboxField.create(this);
    });
};


/*
 * Allows styling of radio buttons by creating additional element after
 * given radio. No real JS API included.
 */
function RadioField(input) {
    var self = this;
    this.$input = jQuery(input).css({'position': 'absolute', 'left': '-99em'});
    this.$fake = jQuery(RadioField.fakeHTML).addClass(this.$input.attr('class')).insertBefore(this.$input);
    this.name = this.$input.attr('name');

    this._focusEvent = function() {
        self._updateHTML(false, true);
        jQuery(self).trigger('focus');
    };

    this._blurEvent = function() {
        self._updateHTML(false, true);
        jQuery(self).trigger('blur');
    };

    this._changeEvent = function() {
        self._updateHTML(false, true);

        var $parentForm = self.$input.closest('form');
        if (!$parentForm.length)
            $parentForm = jQuery(document.body);

        $parentForm.find('input:radio[name="' + self.name + '"]').not(this).each(function() {
            jQuery(this).removeAttr('checked');
            RadioField.create(this)._updateHTML(false, true);
        });

        jQuery(self).trigger('change');
    };

    this._fakeClickEvent = function() {
        self.$input.click();
        self.$fake.addClass('checked');
    };

    this._loadEvent = function() {
        self._updateHTML(false, true);
    };

    this.$input.focus(this._focusEvent).blur(this._blurEvent);
    this.$input.closest('form').bind('reset', this._changeEvent);
    this.$input.bind('click', this._changeEvent);
    this.$fake.click(this._fakeClickEvent);
    this.$fake.mousedown(jQuery.preventDefault);
    jQuery(this._loadEvent);
}

RadioField._instances = [];

RadioField.create = function(input) {
    for (var i = 0; i < RadioField._instances.length; i++)
        if (RadioField._instances[i].$input[0] == input)
            return RadioField._instances[i];

    var radio = new RadioField(input);
    RadioField._instances.push(radio);
    return radio;
};

RadioField.fakeHTML = '<span class="fake-radio"/>';

RadioField.prototype._updateHTML = function(unused, updateFake) {
    if (updateFake) {
        this.$fake.toggleClass('checked', this.$input.is(':checked'));
        this.$fake.closest('label').toggleClass('checked', this.$input.is(':checked'));
    }
};

jQuery.fn.radioField = function() {
    return this.each(function() {
        RadioField.create(this);
    });
};


/*
 * Autocomplete field
 */
function AutocompleteField($element, options) {
    options = get(options, {});
    var self = this;

    this.$element = $element.attr('autocomplete', 'off');
    this.$dropdown = null;
    this.url = options.url;
    this.cache = {};
    this.lastQuery = '';
    this.keyTimer = null;
    this.keyTimerTime = get(options.keyTimerTime, 500);
    this.varname = get(options.varname, 'keywords');

    this._keyEvent = function(e) {
        var value = self.$element.val();
        var dropdownVisible = self.$dropdown ? self.$dropdown.closest('body').length : false;

        if (dropdownVisible) {
            //down arrow
            if (e.keyCode == 40) {
                var $next = self.$dropdown.find('li.active').next();
                if (!$next.length)
                    $next = self.$dropdown.find('li:first-child');
                $next.addClass('active').siblings().removeClass('active');
            }

            //up arrow
            if (e.keyCode == 38) {
                var $prev = self.$dropdown.find('li.active').prev();
                if (!$prev.length)
                    $prev = self.$dropdown.find('li:last-child');
                $prev.addClass('active').siblings().removeClass('active');
            }

            //enter
            if (e.keyCode == 13) {
                var $active = self.$dropdown.find('li.active');
                if ($active.length)
                    self.setValue(self.getValueFromDropdown($active));
                self.hideDropdown();
            }

            //escape
            if (e.keyCode == 27)
                self.hideDropdown();
        }

        if (value == self.lastQuery && dropdownVisible)
            return;

        clearTimeout(self.keyTimer);
        self.keyTimer = setTimeout(function() {
            if (value == '')
                self.hideDropdown();
            else
                self.getHints(value);
        }, self.keyTimerTime);
    };

    this._dropdownClickEvent = function(e) {
        e.preventDefault();
        self.setValue(self.getValueFromDropdown(jQuery(this)));
    };

    this._blurEvent = function(e) {
        self.hideDropdown();
    };

    this._submitEvent = function(e) {
        if (self.$dropdown && self.$dropdown.closest('body').length)
            e.preventDefault();
    };

    jQuery(this.$element).keyup(this._keyEvent);
    jQuery(this.$element).blur(this._blurEvent);
    jQuery(this.$element).change(this._changeEvent);
    jQuery(this.$element).closest('form').bind('submit', this._submitEvent);
}


AutocompleteField.prototype.responseToChoices = function(response) {
    // Reformat response to this format: [[value, label], [value, label]];
    var choices = [];

    for (var i = 0; i < response.length; i++)
        if (typeof response[i] == 'string')
            choices.push([response[i], response[i]]);
        else
            choices.push(response[i]);

    return choices;
};

AutocompleteField.prototype.getHints = function(query) {
    var self = this;

    if (query == '')
        return;

    this.lastQuery = query;

    if (this.cache[query]) {
        this.success();
        return;
    }

    var data = {};
    data[this.varname] = query;

    $.getJSON(this.url, data, function(response) {
        self.cache[query] = self.responseToChoices(response);
        if (self.lastQuery == query)
            self.success();
    });
};

AutocompleteField.prototype.success = function() {
    this.hideDropdown();
    this.showDropdown();
};


AutocompleteField.prototype.dropdownHtml = function(element) {
    return '<li data-value="' + escapeHtml(element[0]) + '">' + escapeHtml(element[1]) + '</li>';
};

AutocompleteField.prototype.showDropdown = function() {
    var choices = this.cache[this.lastQuery];
    var html = '';

    for (var i = 0; i < choices.length; i++)
        html += this.dropdownHtml(choices[i]);

    html = '<div class="autocomplete-dropdown ' + this.$element.attr('class') + '"><div><ul>' + html + '</ul></div></div>';

    var offset = this.$element.offset();

    this.$dropdown = jQuery(html).appendTo(document.body).css({
        'left': offset.left,
        'top': offset.top + this.$element.outerHeight(),
        'min-width': this.$element.outerWidth(),
        'opacity': 0
    }).stop(true).animate({'opacity': 1}, 250);

    if (jQuery(window).width() < this.$dropdown.outerWidth() + offset.left)
        this.$dropdown.css('left', '-=' + this.$element.outerWidth() - this.$dropdown.outerWidth());

    this.$dropdown.find('li').click(this._dropdownClickEvent);
};

AutocompleteField.prototype.hideDropdown = function() {
    var self = this;
    var $dropdown = this.$dropdown;

    if ($dropdown && $dropdown.closest('body').length)
        setTimeout(function() {
            $dropdown.animate({'opacity': 0}, 250, function() {
                $dropdown.remove();
            });
        }, 250);
};

AutocompleteField.prototype.getValueFromDropdown = function($element) {
    return $element.attr('data-value');
};

AutocompleteField.prototype.setValue = function(value) {
    this.$element.val(value);
};

jQuery.fn.autocompleteField = function(options) {
    return this.each(function() {
        new AutocompleteField(jQuery(this), options);
    });
};
