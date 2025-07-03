import type { DictOrArray, Falsy, MapKeys, Prettify } from "./types";

describe("types", () => {
	it("MapKeys extracts key type from Map", () => {
		type MyMap = Map<string, number>;
		type Keys = MapKeys<MyMap>;
		const key: Keys = "foo";
		expect(typeof key).toBe("string");
	});

	it("Prettify flattens intersection types", () => {
		type Ugly = { a: string } & { b: number };
		type Pretty = Prettify<Ugly>;
		const obj: Pretty = { a: "x", b: 1 };
		expect(obj).toEqual({ a: "x", b: 1 });
	});

	it("Falsy matches all falsy values", () => {
		const falsyValues: Falsy[] = [false, 0, "", null, undefined];
		expect(falsyValues.length).toBe(5);
	});

	it("DictOrArray allows object or array", () => {
		const dict: DictOrArray = { a: 1 };
		const arr: DictOrArray = [1, 2, 3];
		expect(typeof dict).toBe("object");
		expect(Array.isArray(arr)).toBe(true);
	});
});
