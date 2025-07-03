import { isDefined } from "./isDefined";

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
