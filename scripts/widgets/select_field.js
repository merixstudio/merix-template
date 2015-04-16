/*
 * Custom, fully styleable select fields.
 */
define('widgets/select_field', ['jquery', 'detect'], function(jQuery, detect) {
    function escapeHTML(s) {
        return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    function SelectField($select, options) {
        options = jQuery.extend({}, options);
        var self = this;
        this.$select = $select;
        this.$fake = this.$select.parent();
        this.$fake.append('<span class="value"/>');
        this.$fakeDropdown = null;
        this.mode = options.mode || SelectField.MODE_DEFAULT;
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
            var value = jQuery(this).find(':hidden').val() || '';
            var $option = self.$select.find('option').removeAttr('selected').filter('[value="' + value + '"]');
            if (!$option.length)
                self.$select.find('option').each(function() {
                    if (value == jQuery(this).text()) {
                        $option = jQuery(this);
                        return false;
                    }
                });
            $option.prop('selected', 'selected');
            self.$select.change();
            self._hideDropdown();
            self._updateFake();
        };

        this.$select.bind('change keypress keydown keyup', this._updateEvent);
        if (detect.device.desktop) {
            this.$select.mousedown(false);
            this.$select.focus(this._showEvent).blur(this._hideEvent);
            this.$select.closest('form').submit(this._submitEvent);
            this.$select.keydown(this._keyEvent);

            this.$fake.mousedown(function(e) {
                e.preventDefault();
                if (self.$fakeDropdown) {
                    self._closeFlag = true;
                }
            }).click(function(e) {
                e.preventDefault();
                if (!self._closeFlag) {
                    self.$select.focus();
                }
                else {
                    self._closeFlag = false;
                }
            });
        }

        jQuery(window).resize(function() {
            self._hideDropdown();
        });

        jQuery(function() {
            self._updateFake();
            self.$select.css({'position': 'absolute', 'opacity': 0}); // .attr('size', 2)
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
        return '<li><a href="#"' + classes + '><input type="hidden" value="' + escapeHTML(value) + '"> ' + escapeHTML(label) + '</a></li>';
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
            html = '<div class="fake-dropdown">\
                        <div class="scrollbar-wrapper">\
                            <div class="scrollbar-clip">\
                                <div class="scrollbar-offset">\
                                    <div class="scrollable">' + html + '</div>\
                                </div>\
                            </div>\
                        </div>\
                    </div>';
        return html;
    };

    SelectField.prototype._updateFake = function() {
        var rawValue = this.$select.find(':selected').val() || '';
        this.$fake.toggleClass('default', rawValue == '');

        this.$fake.find('.value').text(this.$select.find(':selected').text());
        if (this.$fakeDropdown)
            this.$fakeDropdown.find('a').removeClass('selected').find(
                'input[value="' + (this.$select.val() || '') + '"]').closest('a').addClass('selected');
    };

    SelectField.prototype._showDropdown = function() {
        if (!detect.device.desktop)
            return;

        this.$fake.stop(true).css('opacity', 1);
        var scrollableParent = this.$select.closestScrollable();

        if (scrollableParent.is('html') || scrollableParent.is(jQuery(window)))
            scrollableParent = jQuery('body');

        if (!this.$fakeDropdown) {
            var choices = this.$select.optionsToChoices();
            this.$fakeDropdown = jQuery(SelectField.fakeDropdownHTML(choices, this.$select.val() || ''));
            this.$fakeDropdown.show().addClass(this.$select.attr('class'));
            this.$fakeDropdown.mousedown(false);
            this.$fakeDropdown.find('a').click(false).mousedown(this._selectEvent);
            jQuery(document).one('mousedown', this._hideEvent);
        }

        var offset = this.$fake.offsetRelativeTo(scrollableParent);
        var y = Math.round(offset.top);
        if (this.mode == SelectField.MODE_DEFAULT)
            y += this.$fake.outerHeight();
        else if (this.mode == SelectField.MODE_OVERLAP)
            this.$fake.stop(true).animate({'opacity': 0}, 0);

        var x = offset.left;
        if (x > jQuery(window).width() - this.$fakeDropdown.outerWidth())
            x += this.$fake.outerWidth() - this.$fakeDropdown.outerWidth();

        this.$fakeDropdown.css({
            'min-width': this.$fake.outerWidth() + 'px', 'opacity': 0,
            'left': x + 'px', 'top': y + 'px'}).animate({'opacity': 1}, 0).appendTo(scrollableParent);

        this.$fakeDropdown.find('.scrollable').scrollbar();
        this.$fake.addClass('dropdown-visible');
    };

    SelectField.prototype._hideDropdown = function() {
        if (this.$fakeDropdown) {
            this.$fakeDropdown.stop(true).animate({'opacity': 0}, 0, function() {
                jQuery(this).remove();
            });
            this.$fakeDropdown = null;
            if (this.mode == SelectField.MODE_OVERLAP)
                this.$fake.stop(true).css('opacity', 1);
            jQuery(document).unbind('mousedown', this._hideEvent);

            this.$fake.removeClass('dropdown-visible');
        }
    };

    jQuery.fn.selectField = function(options) {
        return this.each(function() {
            new SelectField(jQuery(this), options);
        });
    };

    jQuery.fn.optionsToChoices = function() {
        var choices = [];

        this.children().each(function() {
            var option = jQuery(this), choice;
            if (option.is('option')) {
                var value = option.attr('value') !== null ? option.attr('value') : option.text();
                choice = [value, option.text(), option.attr('class')];
            } else if (option.is('optgroup'))
                choice = [option.attr('label'), option.optionsToChoices(), option.attr('class')];
            choices.push(choice);
        });

        return choices;
    };

    return SelectField;
});
