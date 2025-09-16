/**
 * Selectively calls either method a or b based on the condition.
 * @param a - Function to be called when the condition is true
 * @param b - Function to be called when the condition is false
 * @returns A function that takes a target element and additional values,
 *          which in turn returns a function that takes a condition
 */
declare function toggle(a: (...args: any[]) => void, b: (...args: any[]) => void): (target: HTMLElement, ...value: any[]) => (condition: boolean) => void;
export default toggle;
