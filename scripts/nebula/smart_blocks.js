/*
 * Automatically applies additional classes to an element based on width of this element or its parent.
 *
 * Example, simple settings:
 *
 *     'SMART_BLOCKS': {
 *         // Initial element selector, can be any CSS selector supported by browser.
 *         '.block': {
 *             // Additional classes that will be applied when width of parent is between given numbers.
 *             'small': [0, 299],
 *             'medium': [300, 699],
 *             'medium': 'viewportname',
 *             'big': [700, Infinity],
 *             'big': function(block) {...},
 *         }
 *     }
 */
define('nebula/smart_blocks', ['settings', 'nebula/signal', 'nebula/viewport'], function(settings, Signal, viewport) {
    'use strict';

    var winAPI = window;
    // Signal sent whenever any of the blocks had class changed.
    var onUpdate = new Signal();

    function clean(block, args) {
        if (typeof args === 'function')
            return args(block);
        else if (args instanceof Array && (args.length == 2 || (args.length == 3 && args[2] === 'self')) &&
                 typeof args[0] === 'number' && typeof args[1] === 'number' && args[0] <= args[1]) {
            var width = args[2] === 'self' ? block.offsetWidth : block.parentNode.offsetWidth;
            return args[0] <= width && width <= args[1];
        } else if (typeof args === 'string')
            return viewport.is(args);
        throw new Error('Invalid smart blocks args: ' + args);
    }

    function updateBlock(block, specification, selector) {
        var classModified = false;
        for (var className in specification) {
            var classAdded = block.classList.contains(className);

            if (clean(block, specification[className])) {
                if (!classAdded) {
                    block.classList.add(className);
                    classModified = true;
                }
            } else if (classAdded) {
                block.classList.remove(className);
                classModified = true;
            }
        }
        if (classModified)
            onUpdate.send(selector, block);
    }

    function updateTree(root) {
        var BLOCKS = settings('SMART_BLOCKS', {});
        var selector, blocks, i;
        for (selector in BLOCKS) {
            blocks = root.querySelectorAll(selector);
            for (i = 0; i < blocks.length; i++)
                updateBlock(blocks[i], BLOCKS[selector], selector);
        }
    }

    function updateDocument() {
        updateTree(winAPI.document.body);
    }

    function enable(api) {
        if (api)
            winAPI = api;
        winAPI.addEventListener('resize', updateDocument);
    }

    function disable() {
        winAPI.removeEventListener('resize', updateDocument);
    }

    return {
        'onUpdate': onUpdate,
        'updateBlock': updateBlock,
        'updateTree': updateTree,
        'updateDocument': updateDocument,
        'enable': enable,
        'disable': disable
    };
});
