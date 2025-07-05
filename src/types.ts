/**
 * @fileoverview Utility types for TypeScript projects
 * @module types
 */

/**
 * Extracts the key type from a Map type.
 * @template T - The Map type to extract keys from
 * @example
 * type MyMap = Map<string, number>;
 * type Keys = MapKeys<MyMap>; // string
 */
export type MapKeys<T extends Map<any, any>> = T extends Map<infer K, any> ? K : never;

/**
 * Creates a "prettier" version of a type by flattening intersections and making the type more readable.
 * @template T - The type to prettify
 * @example
 * type Ugly = { a: string } & { b: number };
 * type Pretty = Prettify<Ugly>; // { a: string; b: number }
 */
export type Prettify<T> = {
	[K in keyof T]: T[K];
} & unknown;

/**
 * Union type representing all falsy values in JavaScript/TypeScript.
 * @example
 * function isFalsy(value: unknown): value is Falsy {
 *   return !value;
 * }
 */
export type Falsy = false | 0 | "" | null | undefined;

/**
 * Union type representing either a dictionary object or an array.
 * @example
 * function processData(data: DictOrArray) {
 *   if (Array.isArray(data)) {
 *     // Handle array
 *   } else {
 *     // Handle object
 *   }
 * }
 */
export type DictOrArray = Record<PropertyKey, any> | Array<any>;
