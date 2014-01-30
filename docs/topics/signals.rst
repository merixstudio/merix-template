*******
Signals
*******

Signals are means of communication between decoupled modules. It's an upgraded idea of callbacks.


Built-in signals
================

Some modules in Nebula already provide various signals:

*  :js:attr:`nebula/viewport.onChange` -- Sent when viewport changes (usually due to window resize).

*  :js:attr:`nebula/smartBlocks.onUpdate` -- Sent when an element (smart block) had class changed (usually due to window
   resize).

All these signals are instances of the :js:class:`Signal` class.


Listening to signals
====================

If you want your code to be notified, when given action occurs (when signal is sent), you need to connect a receiver
(callback) function to the given signal. Use the :js:func:`Signal.connect` method for this purpose:

.. js:function:: Signal.connect(receiver)

   :param function receiver: A function, that will be connected to a signal and will be called when this signal is sent.

Below is an example demonstrating how to connect to the :js:attr:`nebula/viewport.onChange` signal:

.. code-block:: javascript

   define('my_module', ['nebula/viewport'], function(viewport) {

       function myCallback() {
          ...
       }

       viewport.onChange.connect(myCallback);  // From now on `myCallback` will be called when a viewport is changed.

       ...
   });

A receiver's return value is ignored by signals, it's not used for any purpose.

Some signals also pass some arguments to receivers. You need to check documentation of the given signal on what
arguments you can receive in your callbacks.


Defining signals
================

You can of course define own signals. This is especially useful if you want to write universal modules that you would
like to be used by other developers. Signals allows you to communicate to the outside, that a given action occurred
inside your code.

.. js:class:: Signal()

   Creates a new signal instance. This class lives in the :file:`nebula/signal` module.

Start by importing the :js:class:`Signal` class and instantiating it:

.. code-block:: javascript

   define('my_module', ['nebula/signal'], function(Signal) {

       var onSomeAction = new Signal();

       ...

       return {
          'onSomeAction': onSomeAction  // Without making it public, it will be useless to others!
       };
   });

The :js:class:`Signal` constructor doesn't accept any arguments. Remember to always publicize all your signals, so
others will be able to import them and connect their callbacks. You can of course have as many signals as you need.

Choosing a proper name for a signal is important. It's recommended to start it with an "on" word (``onUpdate``,
``onChange``, ``onSomething``), followed by a verb.


Sending signals
===============

To notify others that an action occurred in your code, you must use the :js:func:`Signal.send` method.

.. js:function:: Signal.send([arguments, ...])

To send a signal, just call it ``send`` method like this:

.. code-block:: javascript

   onSomeAction.send();

You can also pass as many arguments to the ``send()`` method as you like. All of these arguments will be forwarded to
receivers of the sent signal.

.. code-block:: javascript

   onSomeAction.send(some, args);


Disconnecting signals
=====================

.. js:function:: Signal.disconnect(receiver)

   Use this function to disconnect a receiver from a signal if you do not want to be notified when the given signal is
   sent.

   ``receiver`` must the same function previously used in a :js:func:`Signal.connect` call.
