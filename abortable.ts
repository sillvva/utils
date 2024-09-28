/**
 * Creates an abortable promise.
 * @module
 */

/**
 * Creates an abortable promise.
 * 
 * @param executor {(resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void} - The executor function for the promise.
 * @param options {object} - The options for the promise.
 * @param options.signal {AbortSignal} - An `AbortSignal` to use for the promise.
 * @returns {AbortablePromise<T>} The abortable promise.
 * 
 * @example
 * ```typescript
 * const promise = new AbortablePromise((resolve, reject) => {
 * 	setTimeout(() => {
 * 		resolve("Hello World");
 * 	}, 1000);
 * }, { signal: AbortSignal.timeout(500) });
 * 
 * promise.then((result) => {
 * 	console.log(result); // Hello World
 * }).catch((error) => {
 * 	console.log(error); // Error: The operation was aborted.
 * });
 * ```
 */ 
export class AbortablePromise<T> extends Promise<T> {
	constructor(executor: (resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void, options?: { signal?: AbortSignal }) {
		super((resolve, reject) => {
			options?.signal?.addEventListener("abort", () => {
				reject(options.signal?.reason || new Error("The operation was aborted."));
			});
			executor(resolve, reject);
		});
	}
}