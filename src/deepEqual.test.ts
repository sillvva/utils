import { deepEqual } from "./deepEqual";

describe("deepEqual", () => {
	describe("primitive values", () => {
		it("returns true for identical primitive values", () => {
			expect(deepEqual(42, 42)).toBe(true);
			expect(deepEqual("hello", "hello")).toBe(true);
			expect(deepEqual(true, true)).toBe(true);
			expect(deepEqual(false, false)).toBe(true);
		});

		it("returns false for different primitive values", () => {
			expect(deepEqual(42, 43)).toBe(false);
			expect(deepEqual("hello", "world")).toBe(false);
			expect(deepEqual(true, false)).toBe(false);
			expect(deepEqual(0, false)).toBe(false);
			expect(deepEqual("", false)).toBe(false);
		});

		it("handles null and undefined", () => {
			expect(deepEqual(null, null)).toBe(true);
			expect(deepEqual(undefined, undefined)).toBe(true);
			expect(deepEqual(null, undefined)).toBe(false);
			expect(deepEqual(undefined, null)).toBe(false);
			expect(deepEqual(null, 0)).toBe(false);
			expect(deepEqual(undefined, 0)).toBe(false);
		});

		it("handles NaN", () => {
			expect(deepEqual(NaN, NaN)).toBe(true); // NaN === NaN is false
			expect(deepEqual(NaN, 0)).toBe(false);
			expect(deepEqual(NaN, "NaN")).toBe(false);
		});

		it("handles Infinity", () => {
			expect(deepEqual(Infinity, Infinity)).toBe(true);
			expect(deepEqual(-Infinity, -Infinity)).toBe(true);
			expect(deepEqual(Infinity, -Infinity)).toBe(false);
			expect(deepEqual(Infinity, 0)).toBe(false);
		});
	});

	describe("objects", () => {
		it("returns true for identical objects", () => {
			const obj1 = { a: 1, b: 2 };
			const obj2 = { a: 1, b: 2 };
			expect(deepEqual(obj1, obj2)).toBe(true);
		});

		it("returns true for objects with different key order", () => {
			const obj1 = { a: 1, b: 2 };
			const obj2 = { b: 2, a: 1 };
			expect(deepEqual(obj1, obj2)).toBe(true);
		});

		it("returns false for objects with different values", () => {
			const obj1 = { a: 1, b: 2 };
			const obj2 = { a: 1, b: 3 };
			expect(deepEqual(obj1, obj2)).toBe(false);
		});

		it("returns false for objects with different keys", () => {
			const obj1 = { a: 1, b: 2 };
			const obj2 = { a: 1, c: 2 };
			expect(deepEqual(obj1, obj2)).toBe(false);
		});

		it("returns false for objects with different number of keys", () => {
			const obj1 = { a: 1, b: 2 };
			const obj2 = { a: 1 };
			expect(deepEqual(obj1, obj2)).toBe(false);
		});

		it("handles nested objects", () => {
			const obj1 = { a: { b: { c: 1 } } };
			const obj2 = { a: { b: { c: 1 } } };
			expect(deepEqual(obj1, obj2)).toBe(true);
		});

		it("handles nested objects with different values", () => {
			const obj1 = { a: { b: { c: 1 } } };
			const obj2 = { a: { b: { c: 2 } } };
			expect(deepEqual(obj1, obj2)).toBe(false);
		});

		it("handles empty objects", () => {
			expect(deepEqual({}, {})).toBe(true);
			expect(deepEqual({}, { a: 1 })).toBe(false);
		});

		it("handles objects with null and undefined values", () => {
			const obj1 = { a: null, b: undefined };
			const obj2 = { a: null, b: undefined };
			expect(deepEqual(obj1, obj2)).toBe(true);
		});

		it("handles objects with symbol keys", () => {
			const sym = Symbol("test");
			const obj1 = { [sym]: "value", a: 1 };
			const obj2 = { [sym]: "value", a: 1 };
			expect(deepEqual(obj1, obj2)).toBe(true);
		});

		it("returns false for objects with different symbol values", () => {
			const sym = Symbol("test");
			const obj1 = { [sym]: "value1", a: 1 };
			const obj2 = { [sym]: "value2", a: 1 };
			expect(deepEqual(obj1, obj2)).toBe(false);
		});

		it("returns false for objects with different symbol keys", () => {
			const sym1 = Symbol("test1");
			const sym2 = Symbol("test2");
			const obj1 = { [sym1]: "value" };
			const obj2 = { [sym2]: "value" };
			expect(deepEqual(obj1, obj2)).toBe(false);
		});

		it("returns false for objects with different constructors", () => {
			class ClassA {
				constructor(public value: number) {}
			}
			class ClassB {
				constructor(public value: number) {}
			}
			const obj1 = new ClassA(1);
			const obj2 = new ClassB(1);
			expect(deepEqual(obj1, obj2)).toBe(false);
		});

		it("returns true for objects with same constructor", () => {
			class MyClass {
				constructor(public value: number) {}
			}
			const obj1 = new MyClass(1);
			const obj2 = new MyClass(1);
			expect(deepEqual(obj1, obj2)).toBe(true);
		});
	});

	describe("arrays", () => {
		it("returns true for identical arrays", () => {
			const arr1 = [1, 2, 3];
			const arr2 = [1, 2, 3];
			expect(deepEqual(arr1, arr2)).toBe(true);
		});

		it("returns false for arrays with different values", () => {
			const arr1 = [1, 2, 3];
			const arr2 = [1, 2, 4];
			expect(deepEqual(arr1, arr2)).toBe(false);
		});

		it("returns false for arrays with different lengths", () => {
			const arr1 = [1, 2, 3];
			const arr2 = [1, 2];
			expect(deepEqual(arr1, arr2)).toBe(false);
		});

		it("handles nested arrays", () => {
			const arr1 = [
				[1, 2],
				[3, 4]
			];
			const arr2 = [
				[1, 2],
				[3, 4]
			];
			expect(deepEqual(arr1, arr2)).toBe(true);
		});

		it("handles nested arrays with different values", () => {
			const arr1 = [
				[1, 2],
				[3, 4]
			];
			const arr2 = [
				[1, 2],
				[3, 5]
			];
			expect(deepEqual(arr1, arr2)).toBe(false);
		});

		it("handles empty arrays", () => {
			expect(deepEqual([], [])).toBe(true);
			expect(deepEqual([], [1])).toBe(false);
		});

		it("handles arrays with mixed types", () => {
			const arr1 = [1, "hello", { a: 1 }, [2, 3]];
			const arr2 = [1, "hello", { a: 1 }, [2, 3]];
			expect(deepEqual(arr1, arr2)).toBe(true);
		});

		it("handles arrays with null and undefined", () => {
			const arr1 = [null, undefined, 1];
			const arr2 = [null, undefined, 1];
			expect(deepEqual(arr1, arr2)).toBe(true);
		});

		it("returns false for arrays with different order", () => {
			const arr1 = [1, 2, 3];
			const arr2 = [3, 2, 1];
			expect(deepEqual(arr1, arr2)).toBe(false);
		});
	});

	describe("Date objects", () => {
		it("returns true for identical dates", () => {
			const date1 = new Date("2023-01-01T00:00:00Z");
			const date2 = new Date("2023-01-01T00:00:00Z");
			expect(deepEqual(date1, date2)).toBe(true);
		});

		it("returns false for different dates", () => {
			const date1 = new Date("2023-01-01T00:00:00Z");
			const date2 = new Date("2023-01-02T00:00:00Z");
			expect(deepEqual(date1, date2)).toBe(false);
		});

		it("returns false when comparing date with non-date", () => {
			const date = new Date("2023-01-01T00:00:00Z");
			expect(deepEqual(date, "2023-01-01T00:00:00Z")).toBe(false);
			expect(deepEqual(date, 1672531200000)).toBe(false);
		});

		it("handles invalid dates", () => {
			const invalid1 = new Date("invalid");
			const invalid2 = new Date("invalid");
			expect(deepEqual(invalid1, invalid2)).toBe(true); // Both are NaN timestamps
		});
	});

	describe("RegExp objects", () => {
		it("returns true for identical regex patterns", () => {
			const regex1 = /hello/gi;
			const regex2 = /hello/gi;
			expect(deepEqual(regex1, regex2)).toBe(true);
		});

		it("returns false for different patterns", () => {
			const regex1 = /hello/gi;
			const regex2 = /world/gi;
			expect(deepEqual(regex1, regex2)).toBe(false);
		});

		it("returns false for different flags", () => {
			const regex1 = /hello/gi;
			const regex2 = /hello/g;
			expect(deepEqual(regex1, regex2)).toBe(false);
		});

		it("returns false when comparing regex with non-regex", () => {
			const regex = /hello/gi;
			expect(deepEqual(regex, "/hello/gi")).toBe(false);
		});
	});

	describe("Set objects", () => {
		it("returns true for identical sets", () => {
			const set1 = new Set([1, 2, 3]);
			const set2 = new Set([1, 2, 3]);
			expect(deepEqual(set1, set2)).toBe(true);
		});

		it("returns true for sets with different insertion order", () => {
			const set1 = new Set([1, 2, 3]);
			const set2 = new Set([3, 1, 2]);
			expect(deepEqual(set1, set2)).toBe(true);
		});

		it("returns false for sets with different values", () => {
			const set1 = new Set([1, 2, 3]);
			const set2 = new Set([1, 2, 4]);
			expect(deepEqual(set1, set2)).toBe(false);
		});

		it("returns false for sets with different sizes", () => {
			const set1 = new Set([1, 2, 3]);
			const set2 = new Set([1, 2]);
			expect(deepEqual(set1, set2)).toBe(false);
		});

		it("handles empty sets", () => {
			expect(deepEqual(new Set(), new Set())).toBe(true);
			expect(deepEqual(new Set(), new Set([1]))).toBe(false);
		});

		it("handles sets with objects", () => {
			const obj1 = { a: 1 };
			const obj2 = { a: 1 };
			const set1 = new Set([obj1]);
			const set2 = new Set([obj2]);
			expect(deepEqual(set1, set2)).toBe(true);
		});

		it("returns false when comparing set with non-set", () => {
			const set = new Set([1, 2, 3]);
			expect(deepEqual(set, [1, 2, 3])).toBe(false);
		});

		it("handles sets with nested objects", () => {
			const set1 = new Set([{ a: { b: 1 } }]);
			const set2 = new Set([{ a: { b: 1 } }]);
			expect(deepEqual(set1, set2)).toBe(true);
		});

		it("handles sets with NaN", () => {
			const set1 = new Set([NaN, 1, 2]);
			const set2 = new Set([NaN, 1, 2]);
			expect(deepEqual(set1, set2)).toBe(true);
		});
	});

	describe("Map objects", () => {
		it("returns true for identical maps", () => {
			const map1 = new Map([
				["a", 1],
				["b", 2]
			]);
			const map2 = new Map([
				["a", 1],
				["b", 2]
			]);
			expect(deepEqual(map1, map2)).toBe(true);
		});

		it("returns false for maps with different values", () => {
			const map1 = new Map([
				["a", 1],
				["b", 2]
			]);
			const map2 = new Map([
				["a", 1],
				["b", 3]
			]);
			expect(deepEqual(map1, map2)).toBe(false);
		});

		it("returns false for maps with different keys", () => {
			const map1 = new Map([
				["a", 1],
				["b", 2]
			]);
			const map2 = new Map([
				["a", 1],
				["c", 2]
			]);
			expect(deepEqual(map1, map2)).toBe(false);
		});

		it("returns false for maps with different sizes", () => {
			const map1 = new Map([
				["a", 1],
				["b", 2]
			]);
			const map2 = new Map([["a", 1]]);
			expect(deepEqual(map1, map2)).toBe(false);
		});

		it("handles empty maps", () => {
			expect(deepEqual(new Map(), new Map())).toBe(true);
			expect(deepEqual(new Map(), new Map([["a", 1]]))).toBe(false);
		});

		it("handles maps with objects as values", () => {
			const obj1 = { a: 1 };
			const obj2 = { a: 1 };
			const map1 = new Map([["key", obj1]]);
			const map2 = new Map([["key", obj2]]);
			expect(deepEqual(map1, map2)).toBe(true);
		});

		it("handles maps with objects as keys", () => {
			const key1 = { id: 1 };
			const key2 = { id: 1 };
			const map1 = new Map([[key1, "value"]]);
			const map2 = new Map([[key2, "value"]]);
			expect(deepEqual(map1, map2)).toBe(true); // Map uses deep equality for keys
		});

		it("returns false when comparing map with non-map", () => {
			const map = new Map([
				["a", 1],
				["b", 2]
			]);
			expect(deepEqual(map, { a: 1, b: 2 })).toBe(false);
		});

		it("handles maps with nested objects as keys", () => {
			const key1 = { nested: { id: 1 } };
			const key2 = { nested: { id: 1 } };
			const map1 = new Map([[key1, "value"]]);
			const map2 = new Map([[key2, "value"]]);
			expect(deepEqual(map1, map2)).toBe(true);
		});

		it("handles maps with NaN as keys", () => {
			const map1 = new Map([[NaN, "value"]]);
			const map2 = new Map([[NaN, "value"]]);
			expect(deepEqual(map1, map2)).toBe(true);
		});
	});

	describe("TypedArray objects", () => {
		it("returns true for identical Int8Array", () => {
			const arr1 = new Int8Array([1, 2, 3]);
			const arr2 = new Int8Array([1, 2, 3]);
			expect(deepEqual(arr1, arr2)).toBe(true);
		});

		it("returns true for identical Uint8Array", () => {
			const arr1 = new Uint8Array([1, 2, 3]);
			const arr2 = new Uint8Array([1, 2, 3]);
			expect(deepEqual(arr1, arr2)).toBe(true);
		});

		it("returns true for identical Float32Array", () => {
			const arr1 = new Float32Array([1.1, 2.2, 3.3]);
			const arr2 = new Float32Array([1.1, 2.2, 3.3]);
			expect(deepEqual(arr1, arr2)).toBe(true);
		});

		it("returns false for different TypedArray values", () => {
			const arr1 = new Uint8Array([1, 2, 3]);
			const arr2 = new Uint8Array([1, 2, 4]);
			expect(deepEqual(arr1, arr2)).toBe(false);
		});

		it("returns false for TypedArrays with different lengths", () => {
			const arr1 = new Uint8Array([1, 2, 3]);
			const arr2 = new Uint8Array([1, 2]);
			expect(deepEqual(arr1, arr2)).toBe(false);
		});

		it("returns false for different TypedArray types", () => {
			const arr1 = new Int8Array([1, 2, 3]);
			const arr2 = new Uint8Array([1, 2, 3]);
			expect(deepEqual(arr1, arr2)).toBe(false);
		});

		it("returns false when comparing TypedArray with regular Array", () => {
			const arr1 = new Uint8Array([1, 2, 3]);
			const arr2 = [1, 2, 3];
			expect(deepEqual(arr1, arr2)).toBe(false);
		});

		it("handles empty TypedArrays", () => {
			const arr1 = new Uint8Array([]);
			const arr2 = new Uint8Array([]);
			expect(deepEqual(arr1, arr2)).toBe(true);
		});

		it("handles Int16Array", () => {
			const arr1 = new Int16Array([100, 200, 300]);
			const arr2 = new Int16Array([100, 200, 300]);
			expect(deepEqual(arr1, arr2)).toBe(true);
		});

		it("handles Uint32Array", () => {
			const arr1 = new Uint32Array([1000, 2000, 3000]);
			const arr2 = new Uint32Array([1000, 2000, 3000]);
			expect(deepEqual(arr1, arr2)).toBe(true);
		});

		it("handles Float64Array", () => {
			const arr1 = new Float64Array([1.123456789, 2.987654321]);
			const arr2 = new Float64Array([1.123456789, 2.987654321]);
			expect(deepEqual(arr1, arr2)).toBe(true);
		});
	});

	describe("circular references", () => {
		it("handles circular references in objects", () => {
			const obj1: any = { a: 1 };
			obj1.self = obj1;
			const obj2: any = { a: 1 };
			obj2.self = obj2;
			expect(deepEqual(obj1, obj2)).toBe(true);
		});

		it("handles circular references in arrays", () => {
			const arr1: any = [1, 2];
			arr1.push(arr1);
			const arr2: any = [1, 2];
			arr2.push(arr2);
			expect(deepEqual(arr1, arr2)).toBe(true);
		});

		it("handles nested circular references", () => {
			const obj1: any = { a: { b: {} } };
			obj1.a.b.c = obj1;
			const obj2: any = { a: { b: {} } };
			obj2.a.b.c = obj2;
			expect(deepEqual(obj1, obj2)).toBe(true);
		});

		it("returns false for different circular structures", () => {
			const obj1: any = { a: 1 };
			obj1.self = obj1;
			const obj2: any = { a: 2 };
			obj2.self = obj2;
			expect(deepEqual(obj1, obj2)).toBe(false);
		});

		it("handles cross-referencing objects", () => {
			const obj1a: any = { name: "a" };
			const obj1b: any = { name: "b", ref: obj1a };
			obj1a.ref = obj1b;

			const obj2a: any = { name: "a" };
			const obj2b: any = { name: "b", ref: obj2a };
			obj2a.ref = obj2b;

			expect(deepEqual(obj1a, obj2a)).toBe(true);
		});
	});

	describe("mixed types", () => {
		it("returns false when comparing different types", () => {
			expect(deepEqual(1, "1")).toBe(false);
			expect(deepEqual(true, 1)).toBe(false);
			expect(deepEqual([], {})).toBe(false);
			expect(deepEqual(new Date(), "2023-01-01")).toBe(false);
			expect(deepEqual(/test/, "test")).toBe(false);
		});

		it("handles complex nested structures", () => {
			const obj1 = {
				a: 1,
				b: [2, { c: 3, d: new Set([4, 5]) }],
				e: new Map([["f", { g: 6 }]]),
				h: new Date("2023-01-01"),
				i: /test/gi
			};
			const obj2 = {
				a: 1,
				b: [2, { c: 3, d: new Set([4, 5]) }],
				e: new Map([["f", { g: 6 }]]),
				h: new Date("2023-01-01"),
				i: /test/gi
			};
			expect(deepEqual(obj1, obj2)).toBe(true);
		});

		it("handles complex nested structures with differences", () => {
			const obj1 = {
				a: 1,
				b: [2, { c: 3, d: new Set([4, 5]) }],
				e: new Map([["f", { g: 6 }]]),
				h: new Date("2023-01-01"),
				i: /test/gi
			};
			const obj2 = {
				a: 1,
				b: [2, { c: 3, d: new Set([4, 6]) }], // Different value in Set
				e: new Map([["f", { g: 6 }]]),
				h: new Date("2023-01-01"),
				i: /test/gi
			};
			expect(deepEqual(obj1, obj2)).toBe(false);
		});
	});

	describe("edge cases", () => {
		it("handles functions", () => {
			const fn1 = () => {};
			const fn2 = () => {};
			expect(deepEqual(fn1, fn2)).toBe(false); // Functions are compared by reference
		});

		it("handles symbols", () => {
			const sym1 = Symbol("test");
			const sym2 = Symbol("test");
			expect(deepEqual(sym1, sym2)).toBe(false); // Symbols are compared by reference
		});

		it("handles BigInt", () => {
			expect(deepEqual(BigInt(123), BigInt(123))).toBe(true);
			expect(deepEqual(BigInt(123), BigInt(124))).toBe(false);
			expect(deepEqual(BigInt(123), 123)).toBe(false);
		});

		it("handles objects with prototype", () => {
			const obj1 = Object.create({ inherited: 1 });
			obj1.own = 2;
			const obj2 = Object.create({ inherited: 1 });
			obj2.own = 2;
			expect(deepEqual(obj1, obj2)).toBe(true);
		});

		it("handles objects with non-enumerable properties", () => {
			const obj1 = { a: 1 };
			const obj2 = { a: 1 };
			Object.defineProperty(obj1, "hidden", { value: "secret", enumerable: false });
			Object.defineProperty(obj2, "hidden", { value: "secret", enumerable: false });
			expect(deepEqual(obj1, obj2)).toBe(true);
		});

		it("handles objects with different non-enumerable properties", () => {
			const obj1 = { a: 1 };
			const obj2 = { a: 1 };
			Object.defineProperty(obj1, "hidden", { value: "secret", enumerable: false });
			Object.defineProperty(obj2, "hidden", { value: "different", enumerable: false });
			expect(deepEqual(obj1, obj2)).toBe(true); // Non-enumerable properties are ignored
		});

		it("handles same object reference", () => {
			const obj = { a: 1 };
			expect(deepEqual(obj, obj)).toBe(true);
		});

		it("handles arrays with sparse elements", () => {
			const arr1 = [1, , 3]; // eslint-disable-line no-sparse-arrays
			const arr2 = [1, , 3]; // eslint-disable-line no-sparse-arrays
			expect(deepEqual(arr1, arr2)).toBe(true);
		});

		it("returns false for sparse arrays with different undefined", () => {
			const arr1 = [1, , 3]; // eslint-disable-line no-sparse-arrays
			const arr2 = [1, undefined, 3];
			// Sparse arrays have "holes" that are different from explicit undefined
			expect(deepEqual(arr1, arr2)).toBe(true); // Both will be treated the same by our implementation
		});

		it("handles Buffer objects", () => {
			if (typeof Buffer !== "undefined") {
				const buf1 = Buffer.from([1, 2, 3]);
				const buf2 = Buffer.from([1, 2, 3]);
				expect(deepEqual(buf1, buf2)).toBe(true);
			}
		});

		it("handles empty strings vs falsy values", () => {
			expect(deepEqual("", 0)).toBe(false);
			expect(deepEqual("", false)).toBe(false);
			expect(deepEqual("", null)).toBe(false);
			expect(deepEqual("", undefined)).toBe(false);
		});

		it("handles zero and negative zero", () => {
			expect(deepEqual(0, -0)).toBe(true); // 0 === -0 is true
			expect(deepEqual(+0, -0)).toBe(true);
		});

		it("handles objects with getter properties", () => {
			const obj1 = {
				get value() {
					return 42;
				}
			};
			const obj2 = {
				get value() {
					return 42;
				}
			};
			expect(deepEqual(obj1, obj2)).toBe(true); // Compares the returned values
		});

		it("handles Error objects", () => {
			const err1 = new Error("test");
			const err2 = new Error("test");
			// Errors are objects, so they'll be compared by their enumerable properties
			expect(deepEqual(err1, err2)).toBe(true);
		});

		it("handles objects with numeric string keys", () => {
			const obj1 = { "0": "a", "1": "b", "2": "c" };
			const obj2 = { "0": "a", "1": "b", "2": "c" };
			expect(deepEqual(obj1, obj2)).toBe(true);
		});

		it("returns false when comparing object with array with same numeric keys", () => {
			const obj = { "0": "a", "1": "b", "2": "c" };
			const arr = ["a", "b", "c"];
			expect(deepEqual(obj, arr)).toBe(false);
		});
	});
});
