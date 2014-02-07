*********
Viewports
*********


Viewport module provides a higher level of abstraction than raw media queries.

Before you start using the viewport module, you need to define, what different screen sizes you want to support in
your application. Default configuration already provided in the settings is this::

   'VIEWPORTS': {
       '320': [0, 479],
       '480': [480, 719],
       '720': [720, 959],
       '960': [960, 1279],
       '1280': [1280, 1599],
       '1600': [1600, 1919],
       '1920': [1920, Infinity]
   }

The above :data:`VIEWPORTS` setting defines 7 named screen width ranges, each with an own *alias* (the string value) and
window's width range in which given viewport should be considered active.

Only one viewport can be active at a time, so width ranges cannot overlap.

You can define a very customized list of viewports::

   'VIEWPORTS': {
       'alias': [min-width, max-width],
       ...
   }

You can use ``Infinity`` to define an open range. Media queries and callback functions are also supported, check the
documentation about the :data:`VIEWPORTS` setting.

To access the module, use :func:`require` or :func:`define` like always::

   var viewport = require('nebula/viewport');

   // Or

   define('my_module', ['nebula/viewport'], function(viewport) {
       ...


Purpose
=======

This module is most useful when making more complex responsive sites and CSS-only solution wouldn't be practical. It's
intention is to reduce amount of media queries in CSS and thus simplify code.

Usually you want to detect which viewport is active (which in other words just means how small or big the screen is) and
respond to viewport size changes (usually only rotation of the device).

Example usage::

   viewport.onChange(function(previousAlias, activeAlias) {
       if (activeAlias === '320' || activeAlias === '480')
           // Small screen, so collapse main menu.
           showSmallMenu();
       else
           // Bigger screen, so expand main menu.
           showBigMenu();
   });


Reference
=========

.. function:: viewport.enable()

   Enables the whole module, attaches internal event handler that is monitoring window size changes. Without calling
   this function other functions won't work. You need to call it only once, when the page is loading (though you may
   do it later, if you wish). By default viewport module is initialized in the ``Site`` constructor::

      function Site() {
          viewport.enable();
          ...
      }

.. function:: viewport.disable()

   De-initializes whole module, detaches internal event handler, prevents most other functions from the module from
   working. Not really useful, unless you are doing something very specific.

.. function:: viewport.isEnabled()

   Returns ``true`` if the viewport module was initialized with the :func:`viewport.enable` function, ``false``
   otherwise. Also returns false, if viewport module was disabled with the :func:`viewport.disable` function.

.. function:: viewport.is(aliases)

   :param string aliases: A string with viewport names separated by a single space.
   :returns: ``true`` if any of the viewports is currently active, ``false`` otherwise.

   Example call::

      if (viewport.is('320 480'))
          ...

.. function:: viewport.get()

   Returns alias of the currently active viewport. May return ``null`` if none of the configured viewports is active!
   Only one viewport can be active at a time.

.. function:: viewport.width()

   Returns width of the viewable page area in pixels, ie. internal browser's window width.

.. function:: viewport.height()

   Returns height of the viewable page area in pixels, ie. internal browser's window height.

.. function:: viewport.isPortrait()

   Returns ``true`` if browser's window is in portrait mode, ie. window width is less than or equal to it's height.

.. function:: viewport.isLandscape()

   Returns ``true`` if browser's window is in landscape mode, ie. window height is less than it's width.

Only one of the :func:`viewport.isLandscape` and :func:`viewport.isPortrait` functions returns ``true`` at the given
moment.


Signals
=======

.. attribute:: viewport.onChange

   A :doc:`signal </topics/signals>` that is sent whenever viewport changes, which usually occurs after window size had
   changed.

   Your receiver function will be passed two arguments: previous viewport alias and current viewport alias. Example
   usage::

      viewport.onChange.connect(function(previousAlias, activeAlias) {
          ...
      });

   This signal is sent only when viewport changes, not on every window resize.


CSS helpers
===========

By default there will be a class applied to the body element with an active viewport (prefixed with ``'viewport-'``,
this prefix can be configured with the :data:`VIEWPORT_CLASS_PREFIX` setting).

.. code-block:: html

   <body class="viewport-320 viewport-portrait">

These classes are applied by default: ``viewport-landscape`` or ``viewport-portrait`` and ``viewport-ALIAS``.

The ``viewport-landscape`` and ``viewport-portrait`` classes functionality can be disabled with the
:data:`VIEWPORT_ORIENTATION_CLASS` setting.

The ``viewport-ALIAS`` class functionality cannot be disabled currently.
