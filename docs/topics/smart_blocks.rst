************
Smart Blocks
************


A smart block is a DOM element which can have different CSS classes applied at a run time depending on its parent width.

Before you start using this module you need to configure the :data:`SMART_BLOCKS` setting, below is an example::

   'SMART_BLOCKS': {
       'div.block': {
           'small': [0, 100],
           'medium': [101, 200],
           'big': [201, Infinity]
       },
       'ul.grid>li': {
           'narrow': [200, 480, 'self'],
           'wide': [481, Infinity, 'self']
       }
   }

Above setup means that each ``<div class="block">`` element will become ``<div class="block small">`` when parent
of this element has width between 0 and 100 pixels. When width of a parent of a ``div.block`` changes to 101 px, then
the ``small`` class will be replaced with the ``medium`` class.

Also note that each smart block will be considered separately.

To access the module, use :func:`require` or :func:`define` like always::

   var smartBlocks = require('nebula/smart_blocks');

   // Or

   define('my_module', ['nebula/smart_blocks'], function(smartBlocks) {
       ...



Reference
=========

.. function:: smartBlocks.updateBlock(block, specification)

   Updates given smart block manually.

   :param block: A DOM element that should be updated.
   :param specification: An object whose contents maps a CSS classes to array with rules required to apply given class.

.. function:: smartBlocks.updateTree(root)

   Updates all smart blocks under given ``root`` element. Only smart blocks defined in the :data:`SMART_BLOCKS` setting
   are considered.

   :param root: It should be a DOM element potentially containing any smart blocks, not necessarily as direct children.

.. function:: smartBlocks.updateDocument()

   Updates all smart blocks available on the page. There is no need to call this function manually if
   :func:`smartBlocks.enable` was called previously. This function is a shortcut to
   ``smartBlocks.updateTree(document.body)``.

.. function:: smartBlocks.enable()

   Starts automatically updating all smart blocks on a page (attaches window resize event listener).

.. function:: smartBlocks.disable()

   Stops automatically updating all smart blocks on a page (detaches window resize event listener).


Signals
=======

.. attribute:: smartBlocks.onUpdate

   This :doc:`signal </topics/signals>` is sent whenever a smart block had it's class changed by this module.

   Example usage::

      smartBlocks.onUpdate.connect(function(block) {
          ...
      });

   ``block`` argument will be a DOM element that has classes changed.
