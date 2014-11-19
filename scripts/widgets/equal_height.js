define('widgets/equal_height', ['jquery', 'nebula/viewport'], function(jQuery, viewport) {
    'use strict';

    var groups = {};

    function add(element) {
        element = jQuery(element);
        var groupName = element.data('equal-height-group');
        groups[groupName] = true;
    }

    function updateAll() {
        for (var groupName in groups)
            updateGroup(groupName);
    }

    function updateGroup(groupName) {
        var height = 0;
        
        var elements = jQuery('[data-equal-height-group="' + groupName + '"]').css('height', '');

        for (var i = 0; i < elements.length; i++)
            height = Math.max(height, jQuery(elements[i]).outerHeight());

        elements.css('height', height);
    }

    function handler() {
        add(this);
    }

    jQuery(window).resize(updateAll);
    viewport.onChange.connect(updateAll);

    return {
        'handler': handler,
        'add': add,
        'updateGroup': updateGroup,
        'updateAll': updateAll
    }
});
