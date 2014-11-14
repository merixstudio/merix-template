define('nebula/window', function() {
    /*
     * This module exists only to help unit test other modules that use global functions and classes.
     *
     * Example usage when writing a new module:
     *
     *     define('my_new_module', ['nebula/window'], function(window) {
     *
     *         // In normal module use the `window` variable will point to global window object.
     *
     *     });
     *
     * Later when writing tests, module dependencies can be swapped and custom implementations can be supplied:
     *
     *     var myWindow = { ... };  // Define here required spies and mocks.
     *     var myNewModule = require('my_new_module', {'nebula/window': myWindow});
     */
    'use strict';
    return window;
});
