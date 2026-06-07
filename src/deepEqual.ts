/**
 * Deeply compares two values to determine if they are equal.
 * Handles primitives, objects, arrays, dates, RegExp, Sets, Maps, ArrayBuffers,
 * typed arrays, DataViews, errors, NaN, and circular references.
 *
 * @example Basic usage
 * import { deepEqual } from "@sillvva/utils";
 *
 * const a = { a: 1, b: 2 };
 * const b = { b: 2, a: 1 };
 * console.log(deepEqual(a, b)); // true
 *
 * @example Full comparison
 * console.log(deepEqual(a, b, { full: true }));
 *
 * @param a - First value to compare
 * @param b - Second value to compare
 * @param options - Comparison options
 * @returns true if values are deeply equal, false otherwise
 */
export interface DeepEqualOptions {
	full?: boolean;
	circular?: boolean;
	crossRealm?: boolean;
	reactElements?: boolean;
	compareSymbols?: boolean;
	compareNonEnumerable?: boolean;
	compareDescriptors?: boolean;
	compareMaps?: boolean;
	compareSets?: boolean;
	compareArrayBuffers?: boolean;
	compareTypedArrays?: boolean;
	compareDataViews?: boolean;
	compareErrors?: boolean;
}

interface ResolvedDeepEqualOptions {
	circular: boolean;
	crossRealm: boolean;
	reactElements: boolean;
	compareSymbols: boolean;
	compareNonEnumerable: boolean;
	compareDescriptors: boolean;
	compareMaps: boolean;
	compareSets: boolean;
	compareArrayBuffers: boolean;
	compareTypedArrays: boolean;
	compareDataViews: boolean;
	compareErrors: boolean;
}

interface ReactElementLike {
	$$typeof: symbol;
	type: unknown;
	key: unknown;
	ref: unknown;
	props: unknown;
}

interface ErrorLike {
	name: string;
	message: string;
	cause?: unknown;
	errors?: unknown;
}

const REACT_ELEMENT_TYPE = Symbol.for("react.element");
const OBJECT_TO_STRING = Object.prototype.toString;
const ENGINE = detectEngine();

export function deepEqual(a: unknown, b: unknown, options: DeepEqualOptions = {}): boolean {
	const resolvedOptions = resolveOptions(options);
	const seen = resolvedOptions.circular ? new WeakMap<object, WeakSet<object>>() : undefined;
	return deepEqualImpl(a, b, resolvedOptions, seen);
}

function deepEqualImpl(a: unknown, b: unknown, options: ResolvedDeepEqualOptions, seen: WeakMap<object, WeakSet<object>> | undefined): boolean {
	if (a === b) return true;
	if (Number.isNaN(a) && Number.isNaN(b)) return true;
	if (a === null || b === null || a === undefined || b === undefined) return false;
	if (typeof a !== typeof b) return false;

	if (typeof a !== "object" || typeof b !== "object") {
		return false;
	}

	if (seen && hasSeenPair(seen, a, b)) return true;
	if (seen) markSeenPair(seen, a, b);

	const tagA = getTag(a);
	const tagB = getTag(b);
	if (tagA !== tagB) return false;

	if (isReferenceOnlyTag(tagA)) return false;

	if (options.reactElements && isReactElement(a) && isReactElement(b)) {
		return compareReactElements(a, b, options, seen);
	}

	if (tagA === "[object Date]") {
		const timeA = (a as Date).getTime();
		const timeB = (b as Date).getTime();
		if (Number.isNaN(timeA) && Number.isNaN(timeB)) return true;
		return timeA === timeB;
	}

	if (tagA === "[object RegExp]") {
		const regexpA = a as RegExp;
		const regexpB = b as RegExp;
		return regexpA.source === regexpB.source && regexpA.flags === regexpB.flags;
	}

	if (tagA === "[object ArrayBuffer]" || tagA === "[object SharedArrayBuffer]") {
		return options.compareArrayBuffers ? compareArrayBufferLike(a as ArrayBufferLike, b as ArrayBufferLike) : false;
	}

	if (tagA === "[object DataView]") {
		if (!options.compareDataViews) return false;
		return compareArrayBufferViewBytes(a as ArrayBufferView, b as ArrayBufferView);
	}

	if (ArrayBuffer.isView(a) && ArrayBuffer.isView(b)) {
		if (!options.compareTypedArrays) return false;
		if (!options.crossRealm && (a as { constructor?: Function }).constructor !== (b as { constructor?: Function }).constructor) return false;
		return compareArrayBufferViewBytes(a as ArrayBufferView, b as ArrayBufferView);
	}

	if (tagA === "[object Set]") {
		return options.compareSets ? compareSets(a as Set<unknown>, b as Set<unknown>, options, seen) : false;
	}

	if (tagA === "[object Map]") {
		return options.compareMaps ? compareMaps(a as Map<unknown, unknown>, b as Map<unknown, unknown>, options, seen) : false;
	}

	if (tagA === "[object Error]" || tagA.endsWith("Error]")) {
		if (!options.compareErrors) return false;
		return compareErrors(a as ErrorLike, b as ErrorLike, options, seen);
	}

	if (Array.isArray(a) && Array.isArray(b)) {
		return compareArrays(a, b, options, seen);
	}

	if (!options.crossRealm && (a as { constructor?: Function }).constructor !== (b as { constructor?: Function }).constructor) {
		return false;
	}

	return compareObjects(a as Record<PropertyKey, unknown>, b as Record<PropertyKey, unknown>, options, seen);
}

function resolveOptions(options: DeepEqualOptions): ResolvedDeepEqualOptions {
	const full = options.full === true;
	const resolve = (value: boolean | undefined, fallback: boolean): boolean => (full ? true : (value ?? fallback));

	return {
		circular: resolve(options.circular, true),
		crossRealm: resolve(options.crossRealm, false),
		reactElements: resolve(options.reactElements, false),
		compareSymbols: resolve(options.compareSymbols, true),
		compareNonEnumerable: resolve(options.compareNonEnumerable, false),
		compareDescriptors: resolve(options.compareDescriptors, false),
		compareMaps: resolve(options.compareMaps, true),
		compareSets: resolve(options.compareSets, true),
		compareArrayBuffers: resolve(options.compareArrayBuffers, true),
		compareTypedArrays: resolve(options.compareTypedArrays, true),
		compareDataViews: resolve(options.compareDataViews, true),
		compareErrors: resolve(options.compareErrors, true),
	};
}

function compareArrays(
	a: readonly unknown[],
	b: readonly unknown[],
	options: ResolvedDeepEqualOptions,
	seen: WeakMap<object, WeakSet<object>> | undefined,
): boolean {
	if (a.length !== b.length) return false;

	for (let index = 0; index < a.length; index++) {
		const aHole = !Object.hasOwn(a, index);
		const bHole = !Object.hasOwn(b, index);
		if (aHole && bHole) continue;
		if (aHole !== bHole) return false;
		if (!deepEqualImpl(a[index], b[index], options, seen)) return false;
	}

	return true;
}

function compareSets(
	a: Set<unknown>,
	b: Set<unknown>,
	options: ResolvedDeepEqualOptions,
	seen: WeakMap<object, WeakSet<object>> | undefined,
): boolean {
	if (a.size !== b.size) return false;

	const valuesB = Array.from(b);
	const used = new Array(valuesB.length).fill(false);

	for (const valueA of a) {
		let matched = false;
		for (let index = 0; index < valuesB.length; index++) {
			if (used[index]) continue;
			if (deepEqualImpl(valueA, valuesB[index], options, seen)) {
				used[index] = true;
				matched = true;
				break;
			}
		}
		if (!matched) return false;
	}

	return true;
}

function compareMaps(
	a: Map<unknown, unknown>,
	b: Map<unknown, unknown>,
	options: ResolvedDeepEqualOptions,
	seen: WeakMap<object, WeakSet<object>> | undefined,
): boolean {
	if (a.size !== b.size) return false;

	const entriesB = Array.from(b.entries());
	const used = new Array(entriesB.length).fill(false);

	for (const [keyA, valueA] of a) {
		let matched = false;
		for (let index = 0; index < entriesB.length; index++) {
			if (used[index]) continue;
			const [keyB, valueB] = entriesB[index];
			if (!deepEqualImpl(keyA, keyB, options, seen)) continue;
			if (!deepEqualImpl(valueA, valueB, options, seen)) return false;
			used[index] = true;
			matched = true;
			break;
		}
		if (!matched) return false;
	}

	return true;
}

function compareArrayBufferLike(a: ArrayBufferLike, b: ArrayBufferLike): boolean {
	if (a.byteLength !== b.byteLength) return false;

	const bytesA = new Uint8Array(a);
	const bytesB = new Uint8Array(b);

	if (ENGINE === "v8") {
		return compareBytesWithUint32(bytesA, bytesB);
	}

	if (ENGINE === "jsc") {
		return compareBytesWithBigUint64(bytesA, bytesB);
	}

	return compareBytes(bytesA, bytesB);
}

function compareArrayBufferViewBytes(a: ArrayBufferView, b: ArrayBufferView): boolean {
	if (a.byteLength !== b.byteLength) return false;
	return compareBytesForView(a, b);
}

function compareBytesWithUint32(bytesA: Uint8Array, bytesB: Uint8Array): boolean {
	const viewA = new DataView(bytesA.buffer, bytesA.byteOffset, bytesA.byteLength);
	const viewB = new DataView(bytesB.buffer, bytesB.byteOffset, bytesB.byteLength);
	let index = 0;
	const chunkEnd = bytesA.byteLength - (bytesA.byteLength % 4);

	for (; index < chunkEnd; index += 4) {
		if (viewA.getUint32(index, true) !== viewB.getUint32(index, true)) return false;
	}

	for (; index < bytesA.byteLength; index++) {
		if (bytesA[index] !== bytesB[index]) return false;
	}

	return true;
}

function compareBytesWithBigUint64(bytesA: Uint8Array, bytesB: Uint8Array): boolean {
	const viewA = new DataView(bytesA.buffer, bytesA.byteOffset, bytesA.byteLength);
	const viewB = new DataView(bytesB.buffer, bytesB.byteOffset, bytesB.byteLength);
	let index = 0;
	const chunkEnd = bytesA.byteLength - (bytesA.byteLength % 8);

	if (typeof viewA.getBigUint64 !== "function") {
		return compareBytes(bytesA, bytesB);
	}

	for (; index < chunkEnd; index += 8) {
		if (viewA.getBigUint64(index, true) !== viewB.getBigUint64(index, true)) return false;
	}

	for (; index < bytesA.byteLength; index++) {
		if (bytesA[index] !== bytesB[index]) return false;
	}

	return true;
}

function compareBytes(bytesA: Uint8Array, bytesB: Uint8Array): boolean {
	for (let index = 0; index < bytesA.length; index++) {
		if (bytesA[index] !== bytesB[index]) return false;
	}

	return true;
}

function compareBytesForView(a: ArrayBufferView, b: ArrayBufferView): boolean {
	const bytesA = new Uint8Array(a.buffer, a.byteOffset, a.byteLength);
	const bytesB = new Uint8Array(b.buffer, b.byteOffset, b.byteLength);

	if (ENGINE === "v8") {
		return compareBytesWithUint32(bytesA, bytesB);
	}

	if (ENGINE === "jsc") {
		return compareBytesWithBigUint64(bytesA, bytesB);
	}

	return compareBytes(bytesA, bytesB);
}

function compareErrors(a: ErrorLike, b: ErrorLike, options: ResolvedDeepEqualOptions, seen: WeakMap<object, WeakSet<object>> | undefined): boolean {
	if (a.name !== b.name || a.message !== b.message) return false;
	if (a.cause !== undefined || b.cause !== undefined) {
		if (!deepEqualImpl(a.cause, b.cause, options, seen)) return false;
	}
	if (a.errors !== undefined || b.errors !== undefined) {
		if (!deepEqualImpl(a.errors, b.errors, options, seen)) return false;
	}

	return compareObjects(a as unknown as Record<PropertyKey, unknown>, b as unknown as Record<PropertyKey, unknown>, options, seen);
}

function compareReactElements(
	a: ReactElementLike,
	b: ReactElementLike,
	options: ResolvedDeepEqualOptions,
	seen: WeakMap<object, WeakSet<object>> | undefined,
): boolean {
	return (
		a.$$typeof === b.$$typeof &&
		deepEqualImpl(a.type, b.type, options, seen) &&
		deepEqualImpl(a.key, b.key, options, seen) &&
		deepEqualImpl(a.ref, b.ref, options, seen) &&
		deepEqualImpl(a.props, b.props, options, seen)
	);
}

function compareObjects(
	a: Record<PropertyKey, unknown>,
	b: Record<PropertyKey, unknown>,
	options: ResolvedDeepEqualOptions,
	seen: WeakMap<object, WeakSet<object>> | undefined,
): boolean {
	const keysA = getOwnKeys(a, options);
	const keysB = getOwnKeys(b, options);

	if (keysA.length !== keysB.length) return false;

	const keySetB = new Set<PropertyKey>(keysB);
	for (const key of keysA) {
		if (!keySetB.has(key)) return false;

		if (options.compareDescriptors) {
			const descriptorA = Object.getOwnPropertyDescriptor(a, key);
			const descriptorB = Object.getOwnPropertyDescriptor(b, key);
			if (!descriptorA || !descriptorB) return false;
			if (descriptorA.enumerable !== descriptorB.enumerable) return false;
			if (descriptorA.configurable !== descriptorB.configurable) return false;
			if ("writable" in descriptorA || "writable" in descriptorB) {
				if ((descriptorA as PropertyDescriptor).writable !== (descriptorB as PropertyDescriptor).writable) return false;
			}
			if ("get" in descriptorA || "get" in descriptorB) {
				if (descriptorA.get !== descriptorB.get) return false;
				if (descriptorA.set !== descriptorB.set) return false;
				continue;
			}
		}

		if (!deepEqualImpl(a[key], b[key], options, seen)) return false;
	}

	return true;
}

function getOwnKeys(value: Record<PropertyKey, unknown>, options: ResolvedDeepEqualOptions): PropertyKey[] {
	if (options.compareNonEnumerable) {
		if (options.compareSymbols) {
			return Reflect.ownKeys(value);
		}

		return Reflect.ownKeys(value).filter((key) => typeof key !== "symbol");
	}

	const stringKeys = Object.keys(value);
	if (!options.compareSymbols) {
		return stringKeys;
	}

	return [...stringKeys, ...Object.getOwnPropertySymbols(value)];
}

function detectEngine(): "v8" | "jsc" | "other" {
	const runtime = globalThis as {
		process?: { versions?: Record<string, unknown> };
		navigator?: { userAgent?: string };
	};
	const processVersions = runtime.process?.versions;
	if (processVersions?.v8) return "v8";

	const userAgent = runtime.navigator?.userAgent ?? "";
	if (userAgent.includes("Safari") && !userAgent.includes("Chrome") && !userAgent.includes("Chromium")) return "jsc";

	return "other";
}

function getTag(value: unknown): string {
	return OBJECT_TO_STRING.call(value);
}

function isReferenceOnlyTag(tag: string): boolean {
	return (
		tag === "[object Promise]" ||
		tag === "[object WeakMap]" ||
		tag === "[object WeakSet]" ||
		tag === "[object WeakRef]" ||
		tag === "[object FinalizationRegistry]"
	);
}

function isReactElement(value: unknown): value is ReactElementLike {
	return isObjectLike(value) && (value as ReactElementLike).$$typeof === REACT_ELEMENT_TYPE;
}

function isObjectLike(value: unknown): value is object {
	return typeof value === "object" && value !== null;
}

function hasSeenPair(seen: WeakMap<object, WeakSet<object>>, a: object, b: object): boolean {
	return seen.get(a)?.has(b) ?? false;
}

function markSeenPair(seen: WeakMap<object, WeakSet<object>>, a: object, b: object): void {
	const seenB = seen.get(a);
	if (seenB) {
		seenB.add(b);
		return;
	}

	seen.set(a, new WeakSet([b]));
}
