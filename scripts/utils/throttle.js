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
export default function (scope, delay = 250, callback) {
  let lastExecution;
  let timer;

  // eslint-disable-next-line func-names
  return function () {
    clearTimeout(timer);

    const context = scope || this;

    const now = new Date();
    // eslint-disable-next-line prefer-rest-params
    const args = arguments;

    // eslint-disable-next-line func-names
    const fn = function () {
      lastExecution = now.getTime();
      callback.apply(context, args);
    };

    if (lastExecution && now.getTime() < lastExecution + delay) {
      timer = setTimeout(fn, delay);
    } else {
      fn();
    }
  };
}
