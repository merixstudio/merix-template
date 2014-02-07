##########################
Writing JavaScript modules
##########################


If you have written code in other programming languages (like Python for example), then you already should know what's
a module. Nebula allows you to write your JavaScript code in a similar manner, to divide code into separate
modules and packages, clearly stating dependencies and relations between files. It's very powerful idea, that will
change how you write code. Your code will become simpler, more readable and maintainable.

This solution is similar to the RequireJS, which does support asynchronous code loading. See also:

*  `AMD API wiki <https://github.com/amdjs/amdjs-api/wiki/AMD>`_
*  `Why AMD? (RequireJS) <http://requirejs.org/docs/whyamd.html>`_
*  `Dojo Tutorial: AMD Modules <http://dojotoolkit.org/documentation/tutorials/1.8/modules/>`_

If you are an advanced user of RequireJS, then you should know, that the solution described here is
in many areas different and many 'features' were not implemented on purpose. Summarizing this up: overall idea is very
similar, but API has many differences.

.. note::

   Nebula won't load your modules asynchronously. This is on purpose, to reduce confusion and increase performance
   of complicated applications. Ask your back end developer to merge all JavaScript modules to a single file, this is
   done usually by using some third-party static files compressor.


What's a module?
================

Module
   It's a single JavaScript file, that is a collection of related functions or classes or both. In case of a
   more complicated code a module may also contain only one class definition or only one function. Module should be a
   reusable piece of code, that you will want to use in many software projects.

Package
   It's a group of modules (usually somewhat related).

JavaScript at the time of writing this, doesn't support any kind of modules or packages. We've borrowed this idea
from other programming languages to make writing complex JavaScript applications easier.


How to 'create' a module?
=========================

To define a module, just create a JavaScript file, and write something like this::

   define('great_module', function() {

       // My module code goes here...
       function myFunction() {
           return 5;
       }

       // 'Export' any things you want other developers (or you) should use.
       return {'myFunction': myFunction};
   });

The ``function`` statement at the beginning of the above example is a simple way to make all your code private and
decide which functions and classes should be available to others using the ``return`` statement at the end of module
definition.

To use ``myFunction`` in other modules use the global :js:func:`require` function, which is somewhat similar to Python's
``import`` statement (at least the whole idea is similar).

::

   // 'great_module' must match with what was specified in the define() call above.
   var greatModule = require('great_module');

   greatModule.myFunction();

Below is a more practical example::

   define('numbers', function() {

       function radians(n) {
           return n * Math.PI / 180;
       }

       function degrees(n) {
           return n * 180 / Math.PI;
       }

       return {
           'radians': radians,
           'degrees': degrees
       };
   });

Above is a simple module example with two functions that help converting angles between radians and degrees. When you
want to use these functions, again use :js:func:`require` *anywhere* in your code::

   var numbers = require('numbers');

   numbers.degrees(Math.PI);
   numbers.radians(180);


Dependencies
============

When you have code divided into many small modules it's very important to explicitly state, how modules depend on each
other. This is usually written at the beginning of a module's source code for readability. Using Nebula you can
state dependencies in a :js:func:`define` call like this::

   // Define a module and use some code from the 'numbers' module without calling require().
   define('my_custom_module', ['numbers'], function(numbers) {

       // This is a space of an other module. Here you can use the numbers module from previous example.

       function fullCircle() {
           return numbers.radians(Math.PI * 2);
       }

       return {'fullCircle': fullCircle}
   });

In the above example the ``'my_custom_module'`` uses a ``'numbers'`` module, this is stated in the :js:func:`define`
call.

``dependencies`` is just an array of module names that are required, so the current module can work.

::

   define(moduleName, [dependencies], function(dependency1, dependency2, ...) {
       ...
   });


Using jQuery
------------

By default jQuery is only available as module, there are no ``jQuery`` and ``$`` global variables available
(`'no conflict' mode <http://api.jquery.com/jQuery.noConflict/>`_ is on, to change this toggle the
:js:data:`JQUERY_NO_CONFLICT` setting).

::

   define('my_module', ['jquery'], function(jQuery) {

       jQuery('div').remove();

   });


An alternate syntax
===================

You can also use a shorter syntax when you want to create module that's a group of constants or functions.

::

   define('some_data', {
       'name': 'value',
       ...
   });

   var someData = require('some_data');

   if (someData.name)
       ...

This syntax doesn't allow dependencies to be specified.


The ``'settings'`` module
=========================

You can define configuration options for your application in a ``'settings'`` module. Then, other modules will
reference this settings module and treat it as a central point of a run time configuration.

::

   define('settings', {
       // Used by require.js, defaults to true, used to toggle 'no conflict mode' for jQuery.
       'JQUERY_NO_CONFLICT': false,

       // Other custom, user-defined settings example:
       'DEBUG': true,
       'ANIMATIONS': true,
       'FPS': 60,
       ...
   });

Nebula provies a default settings module, it's in the :file:`/scripts/settings.js` file.

Read more about :doc:`/intro/settings`.


Good practices
==============

Below is a list of good practices, that when followed should somewhat increase code quality and readability.

#. Module names should match 1:1 to JavaScript file names (without extension). Module ``'numbers'`` should reside in a
   file named :file:`numbers.js`. Modules that are inside sub-directories should include those directories in the module
   name. So a module *numbers* placed in a directory *math* should be named ``'math/numbers'``.

   Usually file names are all lower case, also consider separating words with an underscore character. Actually
   CamelCase in module names is not supported and when such module name is used, :func:`define` will throw an
   exception.

#. Although everything in a module code is private, you should export as much as possible, so other developers won't
   have problems to reuse your code. When some variables or functions are considered *internal*, then you may prepend
   an underscore character to their name, so other developers will know that they are messing with some internals.

#. In case of many dependencies it's recommended to write them using the :func:`require` function. Instead::

      define('my_module', ['dep1', 'dep1', 'dep3', 'dep4', ...], function(dep1, dep2, dep3, dep4, ...) {
          ...

   Write this::

      define('my_module', function() {
          var dep1 = require('dep1');
          var dep2 = require('dep2');
          var dep3 = require('dep3');
          var dep4 = require('dep4');
          ...

   The above notation is more verbose, but also more readable in case of many dependencies.

#. If your module needs to initialize itself in some way, it's better if time of this initialization can be chosen
   at run time. For example instead of adding event listeners to some DOM elements, you could write a pair if functions
   ``install()/uninstall()`` or ``enable()/disable()``, so other developers using your module can decide when they want
   to initialize given libraries (probably as late as possible to improve loading time).


Reference
=========


Global functions
----------------

.. function:: define(moduleName[, dependencies], moduleCode)

   Creates a module from ``moduleCode`` and stores it in the internal container for later retrieval with
   :func:`require`.

   :param string moduleName:
      Must be a string with a proper name. Allowed characters are lower case letters, digits, underscores
      and slashes (when module nested in sub-directories). ``moduleName`` should be an absolute path to a module,
      including the file name, but without extension. This value must be unique, no two modules with the same name are
      allowed.

   :param array dependencies:
      Optional, can be specified only if ``moduleCode`` is a function. ``dependencies`` must be an
      array of strings, where each string is name of some other module. Each module must be loaded prior to this point
      and will be passed as an argument to the function specified in ``moduleCode``.

   :param moduleCode:
      Should be a callback function that returns module definition. It will be called immediately and will
      receive all modules specified in ``dependencies`` as arguments. ``moduleCode`` can be also any other object, which
      may prove useful in case of defining application settings or other constant values.

   :throws define.Error:
      When called with ``dependencies`` specified, but ``moduleCode`` is not a function.

   :throws define.ArgumentCountError:
      When called with not enough or too many arguments.

   :throws define.InvalidModuleNameError:
      When ``moduleName`` contains not allowed characters or is empty or is not a string.

   :throws define.InvalidModuleError:
      When ``moduleCode`` is ``undefined`` or it's function that doesn't return anything.

   :throws define.DuplicateModuleError:
      When given ``moduleName`` is already used by an other module.

   :returns: ``undefined``

.. function:: require(moduleName)

   Retrieves module from the internal module storage. ``moduleName`` must be a string.

   :throws require.Error:
      When given module specified in ``moduleName`` doesn't exist (was not defined).

   :throws require.ArgumentsError:
      When arguments count is not one or ``moduleName`` is not a string.

   :returns: module definition, that is any object stored previously with a :func:`define` call with the same module
      name.


Exceptions
----------

.. class:: define.Error

   This exception is thrown by the global :func:`define` function when it's called with ``dependencies`` specified, but
   ``moduleCode`` is not a function.

.. class:: define.ArgumentCountError

   This exception is thrown by the global :func:`define` function when it's called with not enough or too many
   arguments.

.. class:: define.InvalidModuleNameError

   This exception is thrown by the global :func:`define` function when ``moduleName`` contains not allowed
   characters or is empty or is not a string.

.. class:: define.InvalidModuleError

   This exception is thrown by the global :func:`define` function when ``moduleCode`` is ``undefined`` or it's
   function that doesn't return anything.

.. class:: define.DuplicateModuleError

   This exception is thrown by the global :func:`define` function when it's given ``moduleName`` is already used by
   an other module.

.. class:: require.Error

   This exception is thrown by the global :func:`require` or :func:`define` functions when given module
   specified in ``moduleName`` doesn't exist (was not defined).

.. class:: require.ArgumentsError

   This exception is thrown by the global :func:`require` function when arguments count is not one or
   ``moduleName`` is not a string.
