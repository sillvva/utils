/**
 * A module containing general purpose utility functions and types
 * @module
 * 
 * @example Abortable Promise
 * ```typescript
 * import { AbortablePromise } from "@sillvva/utils";
 * 
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
 * @example Substring Count
 * ```typescript
 * import { substrCount } from "@sillvva/utils";
 * 
 * const text = "hello world hello";
 * const count = substrCount(text, "hello");
 * console.log(count); // 2
 * 
 * // With overlapping matches
 * const overlapping = substrCount("aaaa", "aa", true);
 * console.log(overlapping); // 3
 * ```
 * 
 * @example Utility Types
 * ```typescript
 * import type { MapKeys, Prettify, Falsy, DictOrArray } from "@sillvva/utils";
 * 
 * // MapKeys - Extract key type from Map
 * type MyMap = Map<string, number>;
 * type Keys = MapKeys<MyMap>; // string
 * 
 * // Prettify - Flatten intersection types
 * type Ugly = { a: string } & { b: number };
 * type Pretty = Prettify<Ugly>; // { a: string; b: number }
 * 
 * // Falsy - Type guard for falsy values
 * function isFalsy(value: unknown): value is Falsy {
 *   return !value;
 * }
 * 
 * // DictOrArray - Handle objects or arrays
 * function processData(data: DictOrArray) {
 *   if (Array.isArray(data)) {
 *     console.log("Processing array with", data.length, "items");
 *   } else {
 *     console.log("Processing object with keys:", Object.keys(data));
 *   }
 * }
 * ```
 */

export * from "./abortable.ts";
export * from "./slugify.ts";
export * from "./sorter.ts";
export * from "./substrCount.ts";
export * from "./types.ts";

