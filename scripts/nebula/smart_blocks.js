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
 *             'big': [700, Infinity],
 *         }
 *     }
 */
define('nebula/smart_blocks', ['settings', 'nebula/signal'], function(settings, Signal) {
    'use strict';

    var BLOCKS = settings('SMART_BLOCKS', {});

    // Signal sent whenever any of the blocks had class changed.
    var onUpdate = new Signal();

    function updateBlock(block, specification) {
        var classModified = false;
        for (var className in specification) {
            var args = specification[className];
            var minWidth = args[0];
            var maxWidth = args[1];
            var measureSelf = args[2] === 'self';
            var width = measureSelf ? block.offsetWidth : block.parentNode.offsetWidth;
            var classAdded = block.classList.contains(className);

            if (minWidth <= width && width <= maxWidth && !classAdded) {
                block.classList.add(className);
                classModified = true;
            } else if (classAdded) {
                block.classList.remove(className);
                classModified = true;
            }
        }
        if (classModified)
            onUpdate.send(block);
    }

    function updateTree(root) {
        var selector, blocks, i;
        for (selector in BLOCKS) {
            blocks = root.querySelectorAll(selector);
            for (i = 0; i < blocks.length; i++)
                updateBlock(blocks[i], BLOCKS[selector]);
        }
    }

    function updateDocument() {
        updateTree(document.body);
    }

    function enable() {
        window.addEventListener('resize', updateDocument);
    }

    function disable() {
        window.removeEventListener('resize', updateDocument);
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
