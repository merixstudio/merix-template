********
Settings
********


Core settings
=============

.. js:data:: JQUERY_NO_CONFLICT

   Default: ``true``

   Toggles strict `jQuery 'no conflict' mode <http://api.jquery.com/jQuery.noConflict/>`_. By default, when this setting
   is set to ``true``, there are no global ``$`` and ``jQuery`` variables. To use jQuery you need to import it like
   any other JavaScript module, which looks like this:

   .. code-block:: javascript

      var jQuery = require('jquery');

   Or this:

   .. code-block:: javascript

      define('my_module', ['jquery'], function(jQuery) {
          ...
      });

   Note that module names are all lowercase!


Viewport
========

.. js:data:: VIEWPORTS

   Default: ``{}`` (empty object, used when setting is not set)

   Default supplied in the ``settings.js`` file:

   .. code-block:: javascript

      'VIEWPORTS': {
          '320': [0, 479],
          '480': [480, 719],
          '720': [720, 959],
          '960': [960, 1279],
          '1280': [1280, 1599],
          '1600': [1600, 1919],
          '1920': [1920, Infinity]
      }

   An object whose contents maps viewport aliases to a viewport specification, which is usually an array holding
   minimum and maximum window dimensions.

   .. code-block:: javascript

      'VIEWPORTS': {
          '(viewport-name)': (specification),
          ...
      }

   ``(specification)`` can be one of these:

   *  Two-element array: ``[(minWidth), (maxWidth)]`` - minimum and maximum window width.

   *  A Callback function returning ``true`` if given viewport should be activated or ``false`` if not. Such function
      may be used to implement more complex scenarios.

   *  Media query string, e.g. ``'(min-width: 640px) and (max-width: 1280px)'``. Note that media queries are not
      supported in some browsers, including IE8.


.. js:data:: VIEWPORT_CLASS_PREFIX

   Default: ``'viewport-'``

   A string that will be prepended to the body's class denoting current viewport orientation. By default Nebula uses
   ``viewport-landscape`` and ``viewport-portrait`` classes for this purposes.


.. js:data:: VIEWPORT_ORIENTATION_CLASS

   Default: ``true``

   Whether to apply ``viewport-lanscape`` or ``viewport-portrait`` class to the body element denoting browser's window
   dimensions.


Smart blocks
============

.. js:data:: SMART_BLOCKS

   Default: ``{}`` (empty object)

   An object whose contents maps CSS selectors to class names and rules required to apply that class.

   Example:

   .. code-block:: javascript

      'SMART_BLOCKS': {
          'div.block': {
              'small': [0, 100],
              'medium': [101, 200],
              'big': [201, Infinity]
          },
          'ul.grid>li': {
              'narrow': [200, 480, 'self'],
              'wide': [481, Infinity, 'self'],
          }
      }

   General pattern is as follows:

   .. code-block:: javascript

      'SMART_BLOCKS': {
          '(CSS-selector)': {
              '(class-name)': [(min-width), (max-width), ('self')]
              ...
          }
      }

   ``(CSS-selector)``
      This can be any selector supported by a browser.

   ``(class-name)``
      This must be a string with name of the class that will be applied to the element specified with ``(CSS-selector)``
      if conditions for this class are met.

   ``(min-width)``, ``(max-width)``
      Minimum and maximum width of *parent element* required to apply given class.

   ``'self'``
      If this is specified as third parameter, then ``(min-width)`` and ``(max-width)`` are compared against the block
      in context, not its parent element.
