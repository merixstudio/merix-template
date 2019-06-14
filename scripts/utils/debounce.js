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
export default function (scope, delay = 250, callback) {
  let timer = null;

  // eslint-disable-next-line func-names
  return function () {
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }

    const context = scope || this;
    // eslint-disable-next-line prefer-rest-params
    const args = arguments;

    // eslint-disable-next-line func-names
    const fn = function () {
      callback.apply(context, args);
    };

    timer = setTimeout(fn, delay);
  };
}
