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
 * @returns {number} A negative number if `a` is less than `b`, a positive number if `a` is greater than `b`, or 0 if they are equal.
 *
 * @example
 * ```javascript
 * const fruits = ["apple", "Banana", "Orange", "banana"];
 * fruits.sort(sorter);
 * console.log(fruits);
 * // Output: ["apple", "banana", "Banana", "Orange"]
 * ```
 */
export const sorter = (a?: Sortable, b?: Sortable): number => {
	if (typeof a === "boolean" || a === null || a === undefined) a = a ? 0 : 1;
	if (typeof b === "boolean" || b === null || b === undefined) b = b ? 0 : 1;
	if (a instanceof Date) a = a.getTime();
	if (b instanceof Date) b = b.getTime();
	if (typeof a === "string" && typeof b === "string") return collator.compare(a, b);
	if (typeof a === "number" && typeof b === "number") return a - b;
	return collator.compare(a.toString(), b.toString());
};