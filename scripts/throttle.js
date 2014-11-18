/*
 * Throttle execution of a function.
 * Especially useful for rate limiting execution of handlers on events like resize and scroll.
 * Executes callback every X seconds defined in rate variable.
 *
 *  Usage example:
 *      jQuery.on('mousemove', throttle(this, 250, function(event) {
 *          // Event handling code
 *      });
 *
 *  Arguments:
 *      scope - (Object) Passing scope
 *      delay - (Number) > 0 Time beetween callback firing
 *      callback - (Function) callback function
 */
define('throttle', [], function() {
    return function(scope, delay, callback) {
        var delay = delay || 250;
        var lastExecution, timer;

        return function () {
            clearTimeout(timer);

            var context = scope || this;

            var now = new Date,
                args = arguments;

            var fn = function () {
                lastExecution = now.getTime();
                callback.apply(context, args);
            };

            if (lastExecution && now.getTime() < lastExecution + delay)
                timer = setTimeout(fn, delay);
            else
                fn();
        };
    }
});
