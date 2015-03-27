'use strict';

var jQuery = require('jquery');
var settings = require('../settings');
var viewport = require('../nebula/viewport');
jQuery('.accordion-toggle').each(function() {
    var toggler = jQuery(this);
    var target = jQuery('#' + toggler.data('target'));

    function update() {
        toggler.toggleClass('closed');
        target.toggleClass('closed');
    }

    toggler.click(update);
});

jQuery('.accordion').each(function() {
    var accordion = jQuery(this);
    var content = accordion.find('.accordion-content');
    var clip = content.parent();

    function update() {
        clip.css('height', content.outerHeight());
    }

    update();

    viewport.onChange.connect(update);
    jQuery(window).resize(update);
});
