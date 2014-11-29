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
        var elements = [];

        jQuery('[data-equal-height-group="' + groupName + '"]').css('height', '').each(function() {
            var element = jQuery(this);

            if (typeof element.attr('data-group-viewport') != 'undefined') {
                var viewports = element.data('group-viewport').toString().split(' ');
                for (var i = 0; i < viewports.length; i++) {
                    if (viewport.is(viewports[i]))
                        elements.push(element);
                }
            } else
                elements.push(element);
        });

        for (var i = 0; i < elements.length; i++)
            height = Math.max(height, elements[i].outerHeight());

        for (var i = 0; i < elements.length; i++)
            elements[i].css('height', height);
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
