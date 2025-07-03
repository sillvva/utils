import { isOneOf } from "./isOneOf";

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
