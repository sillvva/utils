import {
	isBigInt,
	isBoolean,
	isDefined,
	isFunction,
	isInstanceOfClass,
	isNull,
	isNullish,
	isNumber,
	isObject,
	isOneOf,
	isString,
	isSymbol,
	isTupleOf,
	isTupleOfAtLeast,
	isUndefined
} from "./predicates";

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

describe("isDefined", () => {
	it("returns true for defined values", () => {
		expect(isDefined(0)).toBe(true);
		expect(isDefined("")).toBe(true);
		expect(isDefined(false)).toBe(true);
		expect(isDefined([])).toBe(true);
		expect(isDefined({})).toBe(true);
	});

	it("returns false for undefined", () => {
		expect(isDefined(undefined)).toBe(false);
	});

	it("returns false for null", () => {
		expect(isDefined(null)).toBe(false);
	});

	it("works as a type guard", () => {
		const arr = [1, null, 2, undefined, 3];
		const filtered = arr.filter(isDefined);
		expect(filtered).toEqual([1, 2, 3]);
	});
});

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

describe("isOneOf", () => {
	it("returns true if value is in allowed", () => {
		expect(isOneOf("a", ["a", "b", "c"])).toBe(true);
		expect(isOneOf(2, [1, 2, 3])).toBe(true);
	});

	it("returns false if value is not in allowed", () => {
		expect(isOneOf("d", ["a", "b", "c"])).toBe(false);
		expect(isOneOf(4, [1, 2, 3])).toBe(false);
	});

	it("narrows type correctly", () => {
		const fruits = ["apple", "banana", "orange"] as const;
		function checkFruit(fruit: string) {
			if (isOneOf(fruit, fruits)) {
				// TypeScript should know fruit is one of the fruits
				return fruit;
			}
			return null;
		}
		expect(checkFruit("apple")).toBe("apple");
		expect(checkFruit("pear")).toBeNull();
	});
});

describe("typeof-based predicates", () => {
	describe("isString", () => {
		it("returns true for strings", () => {
			expect(isString("hello")).toBe(true);
			expect(isString("")).toBe(true);
		});

		it("returns false for non-strings", () => {
			expect(isString(123)).toBe(false);
			expect(isString(true)).toBe(false);
			expect(isString(null)).toBe(false);
			expect(isString(undefined)).toBe(false);
		});
	});

	describe("isNumber", () => {
		it("returns true for numbers", () => {
			expect(isNumber(123)).toBe(true);
			expect(isNumber(0)).toBe(true);
			expect(isNumber(NaN)).toBe(true);
			expect(isNumber(Infinity)).toBe(true);
		});

		it("returns false for non-numbers", () => {
			expect(isNumber("123")).toBe(false);
			expect(isNumber(true)).toBe(false);
			expect(isNumber(null)).toBe(false);
		});
	});

	describe("isBoolean", () => {
		it("returns true for booleans", () => {
			expect(isBoolean(true)).toBe(true);
			expect(isBoolean(false)).toBe(true);
		});

		it("returns false for non-booleans", () => {
			expect(isBoolean(1)).toBe(false);
			expect(isBoolean("true")).toBe(false);
			expect(isBoolean(null)).toBe(false);
		});
	});

	describe("isFunction", () => {
		it("returns true for functions", () => {
			expect(isFunction(() => {})).toBe(true);
			expect(isFunction(function () {})).toBe(true);
			expect(isFunction(async () => {})).toBe(true);
		});

		it("returns false for non-functions", () => {
			expect(isFunction("function")).toBe(false);
			expect(isFunction(123)).toBe(false);
			expect(isFunction(null)).toBe(false);
		});
	});

	describe("isSymbol", () => {
		it("returns true for symbols", () => {
			expect(isSymbol(Symbol())).toBe(true);
			expect(isSymbol(Symbol("test"))).toBe(true);
		});

		it("returns false for non-symbols", () => {
			expect(isSymbol("symbol")).toBe(false);
			expect(isSymbol(123)).toBe(false);
		});
	});

	describe("isBigInt", () => {
		it("returns true for bigints", () => {
			expect(isBigInt(BigInt(123))).toBe(true);
			expect(isBigInt(123n)).toBe(true);
		});

		it("returns false for non-bigints", () => {
			expect(isBigInt(123)).toBe(false);
			expect(isBigInt("123")).toBe(false);
		});
	});

	describe("isObject", () => {
		it("returns true for objects", () => {
			expect(isObject({})).toBe(true);
			expect(isObject([])).toBe(true);
			expect(isObject(new Date())).toBe(true);
		});

		it("returns false for null and primitives", () => {
			expect(isObject(null)).toBe(false);
			expect(isObject(123)).toBe(false);
			expect(isObject("string")).toBe(false);
		});
	});

	describe("isUndefined", () => {
		it("returns true for undefined", () => {
			expect(isUndefined(undefined)).toBe(true);
		});

		it("returns false for non-undefined", () => {
			expect(isUndefined(null)).toBe(false);
			expect(isUndefined(0)).toBe(false);
		});
	});

	describe("isNull", () => {
		it("returns true for null", () => {
			expect(isNull(null)).toBe(true);
		});

		it("returns false for non-null", () => {
			expect(isNull(undefined)).toBe(false);
			expect(isNull(0)).toBe(false);
		});
	});

	describe("isNullish", () => {
		it("returns true for null and undefined", () => {
			expect(isNullish(null)).toBe(true);
			expect(isNullish(undefined)).toBe(true);
		});

		it("returns false for non-nullish values", () => {
			expect(isNullish(0)).toBe(false);
			expect(isNullish("")).toBe(false);
			expect(isNullish(false)).toBe(false);
		});
	});
});

describe("isTupleOf", () => {
	it("returns true for arrays with exactly the specified length", () => {
		expect(isTupleOf([1, 2], 2)).toBe(true);
		expect(isTupleOf(["a", "b", "c"], 3)).toBe(true);
		expect(isTupleOf([], 0)).toBe(true);
		expect(isTupleOf([42], 1)).toBe(true);
	});

	it("returns false for arrays with wrong length", () => {
		expect(isTupleOf([1], 2)).toBe(false);
		expect(isTupleOf([1, 2, 3], 2)).toBe(false);
		expect(isTupleOf([1, 2], 3)).toBe(false);
	});

	it("returns false for non-arrays", () => {
		expect(isTupleOf("not an array" as any, 2)).toBe(false);
		expect(isTupleOf(null as any, 2)).toBe(false);
		expect(isTupleOf(undefined as any, 2)).toBe(false);
	});

	it("works as a type guard", () => {
		const numbers = [1, 2, 3];
		if (isTupleOf(numbers, 2)) {
			// TypeScript knows numbers is [number, number]
			const [a, b] = numbers;
			expect(typeof a).toBe("number");
			expect(typeof b).toBe("number");
		}

		const strings = ["hello", "world"];
		if (isTupleOf(strings, 2)) {
			// TypeScript knows strings is [string, string]
			const [first, second] = strings;
			expect(typeof first).toBe("string");
			expect(typeof second).toBe("string");
		}
	});
});

describe("isTupleOfAtLeast", () => {
	it("returns true for arrays with at least the specified length", () => {
		expect(isTupleOfAtLeast([1, 2], 2)).toBe(true);
		expect(isTupleOfAtLeast([1, 2, 3], 2)).toBe(true);
		expect(isTupleOfAtLeast([1, 2, 3, 4], 2)).toBe(true);
		expect(isTupleOfAtLeast([1], 1)).toBe(true);
		expect(isTupleOfAtLeast([], 0)).toBe(true);
	});

	it("returns false for arrays shorter than required", () => {
		expect(isTupleOfAtLeast([1], 2)).toBe(false);
		expect(isTupleOfAtLeast([], 1)).toBe(false);
		expect(isTupleOfAtLeast([1, 2], 3)).toBe(false);
	});

	it("returns false for non-arrays", () => {
		expect(isTupleOfAtLeast("not an array" as any, 2)).toBe(false);
		expect(isTupleOfAtLeast(null as any, 2)).toBe(false);
		expect(isTupleOfAtLeast(undefined as any, 2)).toBe(false);
	});

	it("works as a type guard", () => {
		const numbers = [1, 2, 3, 4];
		if (isTupleOfAtLeast(numbers, 2)) {
			// TypeScript knows numbers is [number, number, ...number[]]
			const [a, b] = numbers;
			expect(typeof a).toBe("number");
			expect(typeof b).toBe("number");
		}

		const strings = ["hello", "world", "extra"];
		if (isTupleOfAtLeast(strings, 2)) {
			// TypeScript knows strings is [string, string, ...string[]]
			const [first, second] = strings;
			expect(typeof first).toBe("string");
			expect(typeof second).toBe("string");
		}
	});
});
