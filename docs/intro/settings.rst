**************
Using settings
**************

.. seealso:: :doc:`Full list of settings </reference/settings>`

The ``'settings'`` module in the :file:`/scripts/settings.js` can be used to customize and configure various Nebula
modules in a single place. other modules will reference this settings module and treat it as a central point of a run
time configuration.

.. code-block:: javascript

   define('settings', {
       // Used by require.js, defaults to true, used to toggle 'no conflict mode' for jQuery.
       'JQUERY_NO_CONFLICT': false,

       // Other custom, user-defined settings example:
       'DEBUG': true,
       'ANIMATIONS': true,
       'FPS': 60,
       ...
   });

All settings are considered constants, thus their names are written using upper-case notation.

You can also use a function to generate settings:

.. code-block:: javascript

   define('settings', function() {
       // Some block of code that calculates various settings.
       var value = someFunction(...);
       ...

       return {
           'SOME_SETTING': value,
           ...
       };
   });


Retrieving settings
===================

Although ``'settings'`` module is usually a simple JavaScript object, when retrieving configuration from other modules,
Nebula gives you a getter function to ease development.

.. code-block:: javascript

   var settings = require('settings');

   if (settings('DEBUG', false))
       ...

Or:

.. code-block:: javascript

   define('my_module', ['settings'], function(settings) {

       if (settings('DEBUG', false))
           ...

   });

``settings`` in this case is a function. It returns value of a configuration option and in case of an unknown, not
defined setting name, this function returns a fallback value (the second argument).

.. js:function:: settings(name, fallback)

   Returns value of a setting from the ``'settings'`` module or ``fallback`` if setting with this name is not defined.

   :param string name: Name of a setting.
   :param fallback: Value to return if given setting was not found.
