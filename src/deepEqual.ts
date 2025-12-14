/**
 * Deeply compares two values to determine if they are equal.
 * Handles primitives, objects, arrays, dates, RegExp, Sets, Maps, typed arrays,
 * NaN, and circular references.
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
 * @param seen - Internal WeakMap for circular reference detection
 * @returns true if values are deeply equal, false otherwise
 */
export function deepEqual(a: unknown, b: unknown, seen = new WeakMap()): boolean {
	// Identical reference or primitive equality
	if (a === b) return true;

	// Handle NaN (NaN !== NaN but should be considered equal)
	if (Number.isNaN(a) && Number.isNaN(b)) return true;

	// Type mismatch
	if (typeof a !== typeof b) return false;

	// Null/undefined checks
	if (a === null || b === null) return false;
	if (a === undefined || b === undefined) return false;

	// Circular reference detection for objects
	if (typeof a === "object" && typeof b === "object") {
		if (seen.has(a)) return seen.get(a) === b;
		seen.set(a, b);
	}

	// Date comparison
	if (a instanceof Date && b instanceof Date) {
		const timeA = a.getTime();
		const timeB = b.getTime();
		// Handle invalid dates (NaN timestamps)
		if (Number.isNaN(timeA) && Number.isNaN(timeB)) return true;
		return timeA === timeB;
	}

	// RegExp comparison
	if (a instanceof RegExp && b instanceof RegExp) {
		return a.source === b.source && a.flags === b.flags;
	}

	// TypedArray comparison
	if (ArrayBuffer.isView(a) && ArrayBuffer.isView(b)) {
		if (a.constructor !== b.constructor) return false;
		const arrA = new Uint8Array(a.buffer, a.byteOffset, a.byteLength);
		const arrB = new Uint8Array(b.buffer, b.byteOffset, b.byteLength);
		if (arrA.length !== arrB.length) return false;
		for (let i = 0; i < arrA.length; i++) {
			if (arrA[i] !== arrB[i]) return false;
		}
		return true;
	}

	// Set comparison
	if (a instanceof Set && b instanceof Set) {
		if (a.size !== b.size) return false;
		for (const aItem of a) {
			let found = false;
			for (const bItem of b) {
				if (deepEqual(aItem, bItem, seen)) {
					found = true;
					break;
				}
			}
			if (!found) return false;
		}
		return true;
	}

	// Map comparison
	if (a instanceof Map && b instanceof Map) {
		if (a.size !== b.size) return false;

		// Compare using deep equality for both keys and values
		for (const [keyA, valA] of a) {
			let foundKey = false;
			for (const [keyB, valB] of b) {
				if (deepEqual(keyA, keyB, seen)) {
					if (!deepEqual(valA, valB, seen)) return false;
					foundKey = true;
					break;
				}
			}
			if (!foundKey) return false;
		}
		return true;
	}

	// Array comparison
	if (Array.isArray(a) && Array.isArray(b)) {
		if (a.length !== b.length) return false;
		for (let i = 0; i < a.length; i++) {
			if (!deepEqual(a[i], b[i], seen)) return false;
		}
		return true;
	}

	// Object comparison
	if (typeof a === "object" && typeof b === "object") {
		// Check if they have the same constructor/prototype
		if (a.constructor !== b.constructor) return false;

		const keysA = Object.keys(a as Record<string, unknown>);
		const keysB = Object.keys(b as Record<string, unknown>);

		if (keysA.length !== keysB.length) return false;

		// Check string keys
		for (const key of keysA) {
			if (!keysB.includes(key)) return false;

			const valA = (a as Record<string, unknown>)[key];
			const valB = (b as Record<string, unknown>)[key];

			if (!deepEqual(valA, valB, seen)) return false;
		}

		// Check Symbol keys
		const symbolsA = Object.getOwnPropertySymbols(a);
		const symbolsB = Object.getOwnPropertySymbols(b);

		if (symbolsA.length !== symbolsB.length) return false;

		for (const sym of symbolsA) {
			if (!symbolsB.includes(sym)) return false;

			const valA = (a as Record<symbol, unknown>)[sym];
			const valB = (b as Record<symbol, unknown>)[sym];

			if (!deepEqual(valA, valB, seen)) return false;
		}

		return true;
	}

	// Primitives that didn't match with ===
	return false;
}
