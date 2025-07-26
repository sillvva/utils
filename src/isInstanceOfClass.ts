/**
 * Type guard function that checks if a value is an instance of a class
 * @module
 */

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
 *
 * @example Filtering class instances from mixed arrays
 * import { isInstanceOfClass } from "@sillvva/utils";
 *
 * class Animal {
 *   constructor(public name: string) {}
 * }
 *
 * const items = [
 *   new Animal("Dog"),
 *   { name: "Cat" }, // plain object
 *   "Bird", // primitive
 *   new Animal("Fish")
 * ];
 *
 * const animals = items.filter((item): item is Animal => isInstanceOfClass(item, Animal));
 * console.log(animals); // [Animal { name: "Dog" }, Animal { name: "Fish" }]
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
