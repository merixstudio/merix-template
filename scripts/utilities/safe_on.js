/*
 * Wraps event handler so that it can be automagically unbound when element is removed from body.
 */

module.exports = function(element, callback, condition) {
    if (element.length > 1)
        throw new Error('SafeOn supports only one element as parameter');

    if (typeof callback != 'function')
        throw new Error('Parameter `callback` must be a function');

    if (!condition)
        condition = function() {
            return document.body.contains(element[0]);
        };
    else if (typeof condition != 'function')
        throw new Error('Parameter `condition` must be a function');

    var wrapper = function(event) {
        if (condition())
            callback.apply(element[0], arguments);
        else
            jQuery(this).off(event.type, wrapper);
    };

    return wrapper;
};
