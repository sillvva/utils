/**
 * Deeply compares two values to determine if they are equal.
 * Handles primitives, objects, arrays, dates, RegExp, Sets, and Maps.
 *
 * @example Basic usage
 * import { deepEqual } from "@sillvva/utils";
 *
 * const a = { a: 1, b: 2 };
 * const b = { b: 2, a: 1 };
 * console.log(deepEqual(a, b)); // true
 *
 * @param a - First value to compare
 * @param b - Second value to compare
 * @returns true if values are deeply equal, false otherwise
 */
export function deepEqual(a: unknown, b: unknown): boolean {
	if (a === b) return true;
	if (typeof a !== typeof b) return false;

	if (a === null || b === null) return false;
	if (a === undefined || b === undefined) return false;

	if (a instanceof Date && b instanceof Date) {
		return a.getTime() === b.getTime();
	}

	if (a instanceof RegExp && b instanceof RegExp) {
		return a.source === b.source && a.flags === b.flags;
	}

	if (a instanceof Set && b instanceof Set) {
		if (a.size !== b.size) return false;
		for (const aItem of a) {
			let found = false;
			for (const bItem of b) {
				if (deepEqual(aItem, bItem)) {
					found = true;
					break;
				}
			}
			if (!found) return false;
		}
		return true;
	}

	if (a instanceof Map && b instanceof Map) {
		if (a.size !== b.size) return false;
		for (const [key, val] of a) {
			if (!b.has(key) || !deepEqual(val, b.get(key))) {
				return false;
			}
		}
		return true;
	}

	if (Array.isArray(a) && Array.isArray(b)) {
		if (a.length !== b.length) return false;
		for (let i = 0; i < a.length; i++) {
			if (!deepEqual(a[i], b[i])) return false;
		}
		return true;
	}

	if (typeof a === "object" && typeof b === "object") {
		const keysA = Object.keys(a as Record<string, unknown>);
		const keysB = Object.keys(b as Record<string, unknown>);

		if (keysA.length !== keysB.length) return false;

		for (const key of keysA) {
			if (!keysB.includes(key)) return false;

			const valA = (a as Record<string, unknown>)[key];
			const valB = (b as Record<string, unknown>)[key];

			if (!deepEqual(valA, valB)) return false;
		}

		return true;
	}

	// Primitives that didn't match with ===
	return false;
}
