/**
 * Creates a shallow copy of an object without the specified keys.
 *
 * This function returns a new object composed of all properties from `obj`
 * whose keys are not present in `keys`.
 *
 * @typeParam T - The source object type.
 * @typeParam K - A readonly tuple/array of keys from `T` to omit.
 * @param obj - The source object.
 * @param keys - The keys to exclude from the resulting object.
 * @returns A new object with the provided keys omitted.
 *
 * @example
 * const user = { id: 1, name: "Jane", email: "jane@example.com" };
 * const safe = omit(user, ["email"]);
 * // Result: { id: 1, name: "Jane" }
 */
export function omit<T extends object, K extends readonly (keyof T)[]>(obj: T, keys: K): Omit<T, K[number]> {
	const set = new Set<keyof T>(keys);
	return Object.fromEntries(Object.entries(obj as Record<string, unknown>).filter(([k]) => !set.has(k as keyof T))) as Omit<T, K[number]>;
}
