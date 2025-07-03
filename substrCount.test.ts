import { substrCount } from "./substrCount";

describe("substrCount", () => {
	it("counts non-overlapping occurrences", () => {
		expect(substrCount("hello world hello", "hello")).toBe(2);
		expect(substrCount("aaaa", "aa")).toBe(2);
	});

	it("counts overlapping occurrences", () => {
		expect(substrCount("aaaa", "aa", true)).toBe(3);
	});

	it("returns string length + 1 for empty substring", () => {
		expect(substrCount("hello", "")).toBe(6);
	});

	it("returns 0 if no matches found", () => {
		expect(substrCount("hello", "xyz")).toBe(0);
	});
});
