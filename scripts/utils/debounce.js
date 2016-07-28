/*
 *  Usage example:
 *      jQuery.on('keyup', debounce(this, 250, function(event) {
 *          // Event handling code
 *      });
 *
 *  Arguments:
 *      scope - (Object) Passing scope
 *      delay - (Number) Delay time after last event to fire callback
 *      callback - (Function) callback function
 */
module.exports = function(scope, delay, callback) {
    var delay = delay || 250;
    var timer = null;

    return function () {
        if (timer !== null) {
            clearTimeout(timer);
            timer = null;
        }

        var context = scope || this;
        var args = arguments;

        var fn = function () {
            callback.apply(context, args);
        };

        timer = setTimeout(fn, delay);
    };
};
