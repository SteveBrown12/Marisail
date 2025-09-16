'use client';
/**
 * Selectively calls either method a or b based on the condition.
 * @param a - Function to be called when the condition is true
 * @param b - Function to be called when the condition is false
 * @returns A function that takes a target element and additional values,
 *          which in turn returns a function that takes a condition
 */
function toggle(a, b) {
  return function (target) {
    for (var _len = arguments.length, value = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      value[_key - 1] = arguments[_key];
    }
    var options = [target].concat(value);
    return function (condition) {
      if (condition) {
        a.apply(void 0, options);
      } else {
        b.apply(void 0, options);
      }
    };
  };
}
export default toggle;