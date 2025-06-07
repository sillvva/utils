/**
 * Creates a debounced version of a function that delays execution until after a specified delay
 * @module
 */

/**
 * Creates a debounced version of a function that delays execution until after a specified delay
 * @param fn The function to debounce
 * @param ms The delay in milliseconds
 * @returns An object with call and cancel methods
 * 
 * @example Basic usage
 * import { debounce } from "@sillvva/utils";
 * 
 * const debouncedFn = debounce((text: string) => {
 *   console.log("Searching for:", text);
 *   return `Results for ${text}`;
 * }, 300);
 * 
 * // Only the last call will execute after 300ms
 * debouncedFn.call("a");
 * debouncedFn.call("ab");
 * debouncedFn.call("abc").then(result => {
 *   console.log(result); // "Results for abc"
 * });
 * 
 * @example With cancellation
 * import { debounce } from "@sillvva/utils";
 * 
 * const debouncedFn = debounce(() => console.log("Executed!"), 1000);
 * 
 * debouncedFn.call();
 * // Cancel before execution
 * setTimeout(() => debouncedFn.cancel(), 500);
 * // "Executed!" will never be logged
 */
export function debounce<A = unknown, R = void>(fn: (args: A) => R, ms: number): {
	call: (args: A) => Promise<R>;
	cancel: () => void;
} {
	let timer: number;

	const call = (args: A): Promise<R> =>
		new Promise((resolve) => {
			if (timer) {
				clearTimeout(timer);
			}

			timer = setTimeout(() => {
				resolve(fn(args));
			}, ms);
		});

	const cancel = () => clearTimeout(timer);

	return {
		call,
		cancel
	};
}