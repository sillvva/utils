import { isInstanceOfClass } from "./isInstanceOfClass";

// Test classes
class TestClass {
	constructor(public value: string) {}
}

class AnotherClass {
	constructor(public number: number) {}
}

class SubClass extends TestClass {
	constructor(value: string, public extra: boolean) {
		super(value);
	}
}

describe("isInstanceOfClass", () => {
	describe("with specific class constructor", () => {
		it("returns true for instances of the specified class", () => {
			const instance = new TestClass("test");
			expect(isInstanceOfClass(instance, TestClass)).toBe(true);
		});

		it("returns true for instances of subclasses", () => {
			const subInstance = new SubClass("test", true);
			expect(isInstanceOfClass(subInstance, TestClass)).toBe(true);
		});

		it("returns false for instances of different classes", () => {
			const instance = new TestClass("test");
			expect(isInstanceOfClass(instance, AnotherClass)).toBe(false);
		});

		it("returns false for plain objects", () => {
			const plainObj = { value: "test" };
			expect(isInstanceOfClass(plainObj, TestClass)).toBe(false);
		});

		it("returns false for primitives", () => {
			expect(isInstanceOfClass("string", TestClass)).toBe(false);
			expect(isInstanceOfClass(123, TestClass)).toBe(false);
			expect(isInstanceOfClass(true, TestClass)).toBe(false);
			expect(isInstanceOfClass(Symbol(), TestClass)).toBe(false);
		});

		it("returns false for null and undefined", () => {
			expect(isInstanceOfClass(null, TestClass)).toBe(false);
			expect(isInstanceOfClass(undefined, TestClass)).toBe(false);
		});

		it("returns false for arrays", () => {
			expect(isInstanceOfClass([], TestClass)).toBe(false);
			expect(isInstanceOfClass([1, 2, 3], TestClass)).toBe(false);
		});

		it("returns false for functions", () => {
			expect(isInstanceOfClass(() => {}, TestClass)).toBe(false);
			expect(isInstanceOfClass(function () {}, TestClass)).toBe(false);
		});

		it("works as a type guard", () => {
			const items = [
				new TestClass("a"),
				{ value: "b" }, // plain object
				new AnotherClass(1),
				new TestClass("c")
			];

			const testClassInstances = items.filter((item): item is TestClass => isInstanceOfClass(item, TestClass));

			expect(testClassInstances).toHaveLength(2);
			expect(testClassInstances[0]).toBeInstanceOf(TestClass);
			expect(testClassInstances[1]).toBeInstanceOf(TestClass);
		});
	});

	describe("without class constructor (checking for any class instance)", () => {
		it("returns true for class instances", () => {
			const testInstance = new TestClass("test");
			const anotherInstance = new AnotherClass(123);
			const subInstance = new SubClass("test", true);

			expect(isInstanceOfClass(testInstance)).toBe(true);
			expect(isInstanceOfClass(anotherInstance)).toBe(true);
			expect(isInstanceOfClass(subInstance)).toBe(true);
		});

		it("returns false for plain objects", () => {
			const plainObj = { value: "test" };
			const emptyObj = {};

			expect(isInstanceOfClass(plainObj)).toBe(false);
			expect(isInstanceOfClass(emptyObj)).toBe(false);
		});

		it("returns false for primitives", () => {
			expect(isInstanceOfClass("string")).toBe(false);
			expect(isInstanceOfClass(123)).toBe(false);
			expect(isInstanceOfClass(true)).toBe(false);
			expect(isInstanceOfClass(Symbol())).toBe(false);
		});

		it("returns false for null and undefined", () => {
			expect(isInstanceOfClass(null)).toBe(false);
			expect(isInstanceOfClass(undefined)).toBe(false);
		});

		it("returns false for arrays", () => {
			expect(isInstanceOfClass([])).toBe(false);
			expect(isInstanceOfClass([1, 2, 3])).toBe(false);
		});

		it("returns false for functions", () => {
			expect(isInstanceOfClass(() => {})).toBe(false);
			expect(isInstanceOfClass(function () {})).toBe(false);
		});

		it("works as a type guard for any class instance", () => {
			const items = [
				new TestClass("a"),
				{ value: "b" }, // plain object
				new AnotherClass(1),
				"string", // primitive
				new SubClass("c", true)
			];

			const classInstances = items.filter((item): item is TestClass | AnotherClass | SubClass => isInstanceOfClass(item));

			expect(classInstances).toHaveLength(3);
			expect(classInstances[0]).toBeInstanceOf(TestClass);
			expect(classInstances[1]).toBeInstanceOf(AnotherClass);
			expect(classInstances[2]).toBeInstanceOf(SubClass);
		});
	});

	describe("edge cases", () => {
		it("handles objects created with Object.create(null)", () => {
			const nullProtoObj = Object.create(null);
			expect(isInstanceOfClass(nullProtoObj)).toBe(false); // Not a plain object
			expect(isInstanceOfClass(nullProtoObj, TestClass)).toBe(false);
		});

		it("handles objects with modified prototypes", () => {
			const obj = {};
			Object.setPrototypeOf(obj, null);
			expect(isInstanceOfClass(obj)).toBe(false); // Not a plain object
		});

		it("handles built-in objects", () => {
			expect(isInstanceOfClass(new Date())).toBe(true);
			expect(isInstanceOfClass(new Date(), Date)).toBe(true);
			expect(isInstanceOfClass(new Date(), TestClass)).toBe(false);

			expect(isInstanceOfClass(new RegExp("test"))).toBe(true);
			expect(isInstanceOfClass(new RegExp("test"), RegExp)).toBe(true);
		});
	});
});
