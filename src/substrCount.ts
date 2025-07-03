/**
 * @fileoverview String utility function for counting substring occurrences
 * @module substrCount
 */

/**
 * Counts the number of occurrences of a substring within a string.
 * 
 * @param string - The string to search within
 * @param subString - The substring to search for
 * @param allowOverlapping - Whether to allow overlapping matches (default: false)
 * @returns The number of occurrences found
 * 
 * @example Basic usage
 * import { substrCount } from "@sillvva/utils";
 * 
 * const text = "hello world hello";
 * const count = substrCount(text, "hello");
 * console.log(count); // 2
 * 
 * @example With overlapping matches
 * import { substrCount } from "@sillvva/utils";
 * 
 * const text = "aaaa";
 * const nonOverlapping = substrCount(text, "aa", false);
 * const overlapping = substrCount(text, "aa", true);
 * console.log(nonOverlapping); // 2
 * console.log(overlapping); // 3
 * 
 * @example Edge cases
 * import { substrCount } from "@sillvva/utils";
 * 
 * // Empty substring returns string length + 1
 * console.log(substrCount("hello", "")); // 6
 * 
 * // No matches found
 * console.log(substrCount("hello", "xyz")); // 0
 */
export function substrCount(string: string, subString: string, allowOverlapping = false): number {
	string += "";
	subString += "";
	if (subString.length <= 0) return string.length + 1;

	var n = 0,
		pos = 0,
		step = allowOverlapping ? 1 : subString.length;

	while (true) {
		pos = string.indexOf(subString, pos);
		if (pos >= 0) {
			++n;
			pos += step;
		} else break;
	}
	return n;
}