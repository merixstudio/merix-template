**********************
Writing jQuery plugins
**********************

This small guide describes how to write a jQuery plugin in a Nebula-based project, especially when there is no global
``jQuery`` variable by default (you can change this by toggling the :js:data:`JQUERY_NO_CONFLICT` setting).

.. note:: Writing modules may be a better idea

   Actually it's not recommended to write jQuery plugins, as JavaScript modules (:js:func:`define`/:js:func:`require`)
   are considered a better practice. More complex functionalities should be implemented as modules.

To get the ``jQuery`` variable, just use the :js:func:`require` function like this::

   // Note that the "q" in module name is lowercase!
   var jQuery = require('jquery');

Above code creates a *global* ``jQuery`` variable when not wrapped in a function, so it's better to make such a
function::

   (function() {
       // This can be skipped if the JQUERY_NO_CONFLICT setting is set to `false`.
       var jQuery = require('jquery');

       ...
   })();

This defines a function and then executes it immediately. All variables declared in that function will be
private to your code and not accessible to others (which is not so good thing, as it may prevent your code to be
reused in more non-standard situations).

You can of course use other modules than jQuery as well::

   (function() {
       var jQuery = require('jquery');
       var viewport = require('nebula/viewport');
       var otherModule = require('other_module');

       ...
   })();

General pattern for writing a jQuery plugin is this::

   (function() {
       var jQuery = require('jquery');

       jQuery.fn.pluginName = function() {
           return this.each(function() {

               // Actual plugin code goes here.

           });
       };
   })();


Third-party plugins
===================

To use a third-party plugin with Nebula you will need to do one of these things:

#. Change the :data:`JQUERY_NO_CONFLICT` setting to ``false`` to enable the global ``jQuery`` variable.

#. Modify plugin code by adding a :func:`require` call retrieving jQuery as a private variable inside plugin's code.
