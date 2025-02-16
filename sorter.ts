/**
 * A comparator function for sorting arrays of strings, numbers, booleans, and dates.
 * @module
 */

/**
 */
const collator: Intl.Collator = new Intl.Collator("en", { numeric: true, sensitivity: "base" });
/**
 * Represents a type that can be sorted.
 * @typedef {string | number | boolean | Date | null} Sortable
 */
type Sortable = string | number | boolean | Date | null;
/**
 * Used as a comparator function for sorting arrays of strings, numbers, booleans, and dates.
 *
 * @param a {string | number | boolean | Date | null | undefined} - The first value to compare.
 * @param b {string | number | boolean | Date | null | undefined} - The second value to compare.
 * @returns {number} A negative number if `a` is less than `b`, a positive number if `a` is greater than `b`, or zero if they are equal.
 *
 * @example Sorting primitives
 * ```typescript
 * const fruits = ["apple", "Banana", "Orange", "banana"];
 * const sorted = fruits.toSorted(sorter);
 * console.log(sorted); // ["apple", "banana", "Banana", "Orange"]
 * ```
 * 
 * @example Sorting objects
 * ```typescript
 * const arrObjs = [{ id: 3 }, { id: 1 }, { id: 2 }];
 * const sortedObjs = arrObjs.toSorted((a, b) => sorter(a.id, b.id));
 * console.log(sortedObjs); // [{ id: 1 }, { id: 2 }, { id: 3 }]
 * ```
 */
export function sorter(a?: Sortable, b?: Sortable): number {
	if (a === b) return 0;
	if (a === false && (b === null || b === undefined)) return -1;
	if (b === false && (a === null || a === undefined)) return 1;
	if (a === null || a === undefined || typeof a === "boolean") a = !!a ? 0 : Infinity;
	if (b === null || b === undefined || typeof b === "boolean") b = !!b ? 0 : Infinity;
	if (a instanceof Date) a = a.getTime();
	if (b instanceof Date) b = b.getTime();
	return collator.compare(a.toString(), b.toString());
}