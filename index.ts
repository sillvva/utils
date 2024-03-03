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
 * const arr = [3, 1, 2];
 * const sorted = arr.sort(sorter);
 * console.log(sorted); // [1, 2, 3]
 * 
 * const arrObjs = [{ id: 3 }, { id: 1 }, { id: 2 }];
 * const sortedObjs = arrObjs.sort((a, b) => sorter(a.id, b.id));
 * console.log(sortedObjs); // [{ id: 1 }, { id: 2 }, { id: 3 }]
 * ```
 */

export * from "./slugify";
export * from "./sorter";

