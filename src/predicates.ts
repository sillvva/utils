/**
 * Type predicate functions for runtime type checking and type narrowing
 * @module
 */

/**
 * Type guard function that checks if a value is defined (not null or undefined)
 * @param value The value to check
 * @returns True if the value is defined, false otherwise
 *
 * @example Basic usage
 * import { isDefined } from "@sillvva/utils";
 *
 * const values = [1, null, 2, undefined, 3];
 * const defined = values.filter(isDefined);
 * console.log(defined); // [1, 2, 3]
 *
 * @example Type narrowing
 * import { isDefined } from "@sillvva/utils";
 *
 * function processValue(value: string | null | undefined) {
 *   if (isDefined(value)) {
 *     // TypeScript knows value is string here
 *     console.log(value.toUpperCase());
 *   }
 * }
 */
export function isDefined<T>(value?: T | null): value is T {
	return value !== undefined && value !== null;
}

/**
 * Type guard function that checks if a value is an instance of a class
 * @param obj The value to check
 * @param ClassConstructor Optional class constructor to check against
 * @returns True if the value is an instance of the specified class (or any class if no constructor provided), false otherwise
 *
 * @example Basic usage with specific class
 * import { isInstanceOfClass } from "@sillvva/utils";
 *
 * class MyClass {}
 * const instance = new MyClass();
 * const plainObj = {};
 *
 * console.log(isInstanceOfClass(instance, MyClass)); // true
 * console.log(isInstanceOfClass(plainObj, MyClass)); // false
 *
 * @example Type narrowing with specific class
 * import { isInstanceOfClass } from "@sillvva/utils";
 *
 * class User {
 *   constructor(public name: string) {}
 * }
 *
 * function processUser(data: unknown) {
 *   if (isInstanceOfClass(data, User)) {
 *     // TypeScript knows data is User here
 *     console.log(data.name);
 *   }
 * }
 *
 * @example Checking for any class instance
 * import { isInstanceOfClass } from "@sillvva/utils";
 *
 * class MyClass {}
 * const instance = new MyClass();
 * const plainObj = {};
 * const primitive = "string";
 *
 * console.log(isInstanceOfClass(instance)); // true (instance of MyClass)
 * console.log(isInstanceOfClass(plainObj)); // false (plain object)
 * console.log(isInstanceOfClass(primitive)); // false (primitive)
 * console.log(isInstanceOfClass(null)); // false (null)
 */
export function isInstanceOfClass<T extends object>(obj: unknown, ClassConstructor?: new (...args: any[]) => T): obj is T {
	// Exclude null and non-objects
	if (obj === null || typeof obj !== "object") return false;

	// If a specific class constructor is provided, check if obj is an instance of that class
	if (ClassConstructor) {
		return obj instanceof ClassConstructor;
	}

	// Otherwise, check if it's an instance of any class (exclude plain objects and arrays)
	const prototype = Object.getPrototypeOf(obj);
	if (prototype === null) return false;
	return prototype !== Object.prototype && prototype !== Array.prototype;
}

/**
 * Checks if a value is one of the allowed values.
 * @param value - The value to check.
 * @param allowed - The allowed values.
 * @returns True if the value is one of the allowed values, false otherwise. And asserts the type of the value to be one of the allowed values.
 *
 * @example
 * ```typescript
 * import { isOneOf } from "@sillvva/utils";
 *
 * // before ❌
 * function checkFruits(fruit: string) {
 * 	if (["apple", "banana", "orange"].includes(fruit)) {
 * 		console.log(fruit); // string
 * 	}
 * }
 *
 * // after ✅
 * function checkFruits(fruit: string) {
 * 	if (isOneOf(fruit, ["apple", "banana", "orange"])) {
 * 		console.log(fruit); // "apple" | "banana" | "orange"
 * 	}
 * }
 * ```
 */
export function isOneOf<TValue, const TAllowed extends TValue>(value: TValue, allowed: ReadonlyArray<TAllowed>): value is TAllowed {
	return allowed.includes(value as TAllowed);
}

/**
 * Type guard that checks if a value is a string
 * @param value The value to check
 * @returns True if the value is a string, false otherwise
 */
export function isString(value: unknown): value is string {
	return typeof value === "string";
}

/**
 * Type guard that checks if a value is a number
 * @param value The value to check
 * @returns True if the value is a number, false otherwise
 */
export function isNumber(value: unknown): value is number {
	return typeof value === "number";
}

/**
 * Type guard that checks if a value is a boolean
 * @param value The value to check
 * @returns True if the value is a boolean, false otherwise
 */
export function isBoolean(value: unknown): value is boolean {
	return typeof value === "boolean";
}

/**
 * Type guard that checks if a value is a function
 * @param value The value to check
 * @returns True if the value is a function, false otherwise
 */
export function isFunction(value: unknown): value is Function {
	return typeof value === "function";
}

/**
 * Type guard that checks if a value is a symbol
 * @param value The value to check
 * @returns True if the value is a symbol, false otherwise
 */
export function isSymbol(value: unknown): value is symbol {
	return typeof value === "symbol";
}

/**
 * Type guard that checks if a value is a bigint
 * @param value The value to check
 * @returns True if the value is a bigint, false otherwise
 */
export function isBigInt(value: unknown): value is bigint {
	return typeof value === "bigint";
}

/**
 * Type guard that checks if a value is an object (but not null)
 * @param value The value to check
 * @returns True if the value is an object and not null, false otherwise
 */
export function isObject(value: unknown): value is object {
	return typeof value === "object" && value !== null;
}

/**
 * Type guard that checks if a value is undefined
 * @param value The value to check
 * @returns True if the value is undefined, false otherwise
 */
export function isUndefined(value: unknown): value is undefined {
	return typeof value === "undefined";
}

/**
 * Type guard that checks if a value is null
 * @param value The value to check
 * @returns True if the value is null, false otherwise
 */
export function isNull(value: unknown): value is null {
	return value === null;
}

/**
 * Type guard that checks if a value is null or undefined
 * @param value The value to check
 * @returns True if the value is null or undefined, false otherwise
 */
export function isNullish(value: unknown): value is null | undefined {
	return value === null || value === undefined;
}

/**
 * Converts an array type into a tuple type with exactly N elements
 * @template Arr - The array type (e.g., number[], string[])
 * @template N - The exact length of the tuple
 */
export type TupleOf<Arr extends readonly any[], N extends number> = Arr extends readonly (infer T)[] ? BuildTuple<T, N> : never;

/**
 * Converts an array type into a tuple type with at least N elements
 * @template Arr - The array type (e.g., number[], string[])
 * @template N - The minimum length of the tuple
 */
export type TupleOfAtLeast<Arr extends readonly any[], N extends number> = Arr extends readonly (infer T)[]
	? N extends 0
		? Arr
		: BuildTuple<T, N> extends infer Tuple extends readonly T[]
		? [...Tuple, ...T[]]
		: never
	: never;

/**
 * Helper type to build a tuple of exactly N elements
 */
type BuildTuple<T, N extends number, Acc extends T[] = []> = Acc["length"] extends N ? Acc : BuildTuple<T, N, [...Acc, T]>;

/**
 * Type guard that checks if an array has exactly the specified length
 * @param value The array to check
 * @param length The exact length the array must have
 * @returns True if the value is an array with exactly the specified length, false otherwise
 *
 * @example
 * ```typescript
 * import { isTupleOf } from "@sillvva/utils";
 *
 * const numbers = [1, 2, 3];
 * if (isTupleOf(numbers, 2)) {
 *   // TypeScript knows numbers is [number, number]
 *   const [a, b] = numbers;
 * }
 * ```
 */
export function isTupleOf<T, N extends number>(value: readonly T[] | T[], length: N): value is TupleOf<readonly T[], N> {
	if (!Array.isArray(value)) return false;
	return value.length === length;
}

/**
 * Type guard that checks if an array has at least the specified length
 * @param value The array to check
 * @param length The minimum length the array must have
 * @returns True if the value is an array with at least the specified length, false otherwise
 *
 * @example
 * ```typescript
 * import { isTupleOfAtLeast } from "@sillvva/utils";
 *
 * const numbers = [1, 2, 3, 4];
 * if (isTupleOfAtLeast(numbers, 2)) {
 *   // TypeScript knows numbers is [number, number, ...number[]]
 *   const [a, b] = numbers;
 * }
 * ```
 */
export function isTupleOfAtLeast<T, N extends number>(value: readonly T[] | T[], length: N): value is TupleOfAtLeast<readonly T[], N> {
	if (!Array.isArray(value)) return false;
	return value.length >= length;
}
