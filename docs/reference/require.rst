#################
nebula/require.js
#################


Global functions
================

.. js:function:: define(moduleName[, dependencies], moduleCode)

   Creates a module from ``moduleCode`` and stores it in the internal container for later retrieval with
   :js:func:`require`.

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
      When ``define()`` is called with ``dependencies`` specified, but ``moduleCode`` is not a function.

   :throws define.ArgumentCountError:
      When called with not enough or too many arguments.

   :throws define.InvalidModuleNameError:
      When ``moduleName`` contains not allowed characters or is empty or is not a string.

   :throws define.InvalidModuleError:
      When ``moduleCode`` is ``undefined`` or it's function that doesn't return anything.

   :throws define.DuplicateModuleError:
      When given ``moduleName`` is already used by an other module.

   :returns: ``undefined``

.. js:function:: require(moduleName)

   Retrieves module from the internal module storage. ``moduleName`` must be a string.

   :throws require.Error:
      When given module specified in ``moduleName`` doesn't exist (was not defined).

   :throws require.ArgumentsError:
      When arguments count is not one or ``moduleName`` is not a string.

   :returns: module definition, that is any object stored previously with a :js:func:`define` call with the same module
      name.


Exceptions
==========

.. js:class:: define.Error

   This exception is thrown by the global :js:func:`define` function when it's called with ``dependencies`` specified, but
   ``moduleCode`` is not a function.

.. js:class:: define.ArgumentCountError

   This exception is thrown by the global :js:func:`define` function when it's called with not enough or too many
   arguments.

.. js:class:: define.InvalidModuleNameError

   This exception is thrown by the global :js:func:`define` function when ``moduleName`` contains not allowed
   characters or is empty or is not a string.

.. js:class:: define.InvalidModuleError

   This exception is thrown by the global :js:func:`define` function when ``moduleCode`` is ``undefined`` or it's
   function that doesn't return anything.

.. js:class:: define.DuplicateModuleError

   This exception is thrown by the global :js:func:`define` function when it's given ``moduleName`` is already used by
   an other module.

.. js:class:: require.Error

   This exception is thrown by the global :js:func:`require` or :js:func:`define` functions when given module
   specified in ``moduleName`` doesn't exist (was not defined).

.. js:class:: require.ArgumentsError

   This exception is thrown by the global :js:func:`require` function when arguments count is not one or
   ``moduleName`` is not a string.
