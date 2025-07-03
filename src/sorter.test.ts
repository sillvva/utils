import { sorter } from "./sorter";

describe("sorter", () => {
	it("sorts strings case-insensitively and numerically", () => {
		const arr = ["apple", "Banana", "Orange", "banana"];
		expect([...arr].sort(sorter)).toEqual(["apple", "Banana", "banana", "Orange"]);
	});

	it("sorts numbers", () => {
		const arr = [3, 1, 2];
		expect([...arr].sort(sorter)).toEqual([1, 2, 3]);
	});

	it("sorts booleans and null/undefined", () => {
		const arr = [true, undefined, false, null];
		expect([...arr].sort(sorter)).toEqual([true, false, null, undefined]);
	});

	it("sorts dates", () => {
		const d1 = new Date(2020, 1, 1);
		const d2 = new Date(2021, 1, 1);
		const arr = [d2, d1];
		expect([...arr].sort(sorter)).toEqual([d1, d2]);
	});

	it("sorts objects by property", () => {
		const arr = [{ id: 3 }, { id: 1 }, { id: 2 }];
		expect([...arr].sort((a, b) => sorter(a.id, b.id))).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
	});
});
