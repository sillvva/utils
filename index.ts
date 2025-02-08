/**
 * A module containing general purpose utility functions
 * @module
 * 
 * @example Slugify
 * ```typescript
 * import { slugify } from "@sillvva/utils";
 * 
 * const slug = slugify("Hello World");
 * console.log(slug); // hello-world
 * ```
 * 
 * @example Sorter
 * ```typescript
 * import { sorter } from "@sillvva/utils";
 * 
 * const fruits = ["apple", "Banana", "Orange", "banana"];
 * const sorted = fruits.toSorted(sorter);
 * console.log(sorted); // ["apple", "banana", "Banana", "Orange"]
 * 
 * const arrObjs = [{ id: 3 }, { id: 1 }, { id: 2 }];
 * const sortedObjs = arrObjs.toSorted((a, b) => sorter(a.id, b.id));
 * console.log(sortedObjs); // [{ id: 1 }, { id: 2 }, { id: 3 }]
 * ```
 * 
 * @example Abortable Promise
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

export * from "./abortable.ts";
export * from "./slugify.ts";
export * from "./sorter.ts";

