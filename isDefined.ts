/**
 * Type guard function that checks if a value is defined (not null or undefined)
 * @param value The value to check
 * @returns True if the value is defined, false otherwise
 * 
 * @example Basic usage
 * ```typescript
 * import { isDefined } from "@sillvva/utils";
 * 
 * const values = [1, null, 2, undefined, 3];
 * const defined = values.filter(isDefined);
 * console.log(defined); // [1, 2, 3]
 * ```
 * 
 * @example Type narrowing
 * ```typescript
 * import { isDefined } from "@sillvva/utils";
 * 
 * function processValue(value: string | null | undefined) {
 *   if (isDefined(value)) {
 *     // TypeScript knows value is string here
 *     console.log(value.toUpperCase());
 *   }
 * }
 * ```
 */
export function isDefined<T>(value?: T | null): value is T {
	return value !== undefined && value !== null;
}