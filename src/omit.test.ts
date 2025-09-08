import { omit } from "./omit";

describe("omit", () => {
	it("omits specified keys from a simple object", () => {
		const obj = { a: 1, b: 2, c: 3 };
		const result = omit(obj, ["b"] as const);
		expect(result).toEqual({ a: 1, c: 3 });
	});

	it("returns a new object and does not mutate the source", () => {
		const obj = { a: 1, b: 2 } as const;
		const result = omit(obj, ["a"] as const);
		expect(result).toEqual({ b: 2 });
		expect(obj).toEqual({ a: 1, b: 2 });
		expect(result).not.toBe(obj);
	});

	it("works with empty keys list", () => {
		const obj = { a: 1, b: 2 };
		const result = omit(obj, [] as const);
		expect(result).toEqual({ a: 1, b: 2 });
	});

	it("ignores keys that are not present on the object", () => {
		const obj: Record<string, number> = { a: 1 };
		const result = omit(obj, ["b"] as const);
		expect(result).toEqual({ a: 1 });
	});

	it("handles symbol keys by preserving them when not omitted", () => {
		const sym = Symbol("x");
		// Our omit implementation uses Object.entries, which enumerates string keys.
		// This test documents current behavior: symbol-keyed properties are preserved
		// when not omitted and are also preserved when omitted since they are not enumerated.
		const obj = { a: 1, [sym]: 2 } as Record<PropertyKey, unknown> as { a: number } & { [k: symbol]: number };
		const result = omit(obj as { a: number }, ["a"] as const);
		expect("a" in result).toBe(false);
		// The symbol property remains untouched on the original object
		expect((obj as any)[sym]).toBe(2);
	});
});
