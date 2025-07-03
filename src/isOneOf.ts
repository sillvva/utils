/**
 * Checks if a value is one of the allowed values.
 * @module
 */

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
 */
export function isOneOf<TValue, const TAllowed extends TValue>(
  value: TValue,
  allowed: ReadonlyArray<TAllowed>
): value is TAllowed {
  return allowed.includes(value as TAllowed);
}