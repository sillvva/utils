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
			expect(deepEqual(NaN, NaN)).toBe(false); // NaN === NaN is false
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
			expect(deepEqual(map1, map2)).toBe(false); // Map uses reference equality for keys
		});

		it("returns false when comparing map with non-map", () => {
			const map = new Map([
				["a", 1],
				["b", 2]
			]);
			expect(deepEqual(map, { a: 1, b: 2 })).toBe(false);
		});
	});

	describe("mixed types", () => {
		it("returns false when comparing different types", () => {
			expect(deepEqual(1, "1")).toBe(false);
			expect(deepEqual(true, 1)).toBe(false);
			expect(deepEqual([], {})).toBe(true); // Empty array vs empty object - both have no enumerable keys
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
	});
});
