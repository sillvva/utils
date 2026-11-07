import { sorter } from "./sorter";

describe("sorter", () => {
	it("sorts strings case-insensitively and numerically", () => {
		const arr = ["apple", "Banana", "orange", "banana"];
		expect([...arr].sort(sorter)).toEqual(["apple", "banana", "Banana", "orange"]);
	});

	it("sorts numbers", () => {
		const arr = [10, 2, 1, 100, 20];
		expect([...arr].sort(sorter)).toEqual([1, 2, 10, 20, 100]);
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

	it("sorts UUIDv7 ids lexicographically", () => {
		const ids = [
			"019a1234-5678-7abc-8def-000000000001",
			"01800000-0000-7000-8000-000000000000",
			"019b0000-0000-7000-8000-000000000000",
			"019a0fff-ffff-7fff-8fff-ffffffffffff",
			"019a1000-0000-7000-8000-000000000000"
		];
		expect([...ids].sort(sorter)).toEqual([
			"01800000-0000-7000-8000-000000000000",
			"019a0fff-ffff-7fff-8fff-ffffffffffff",
			"019a1000-0000-7000-8000-000000000000",
			"019a1234-5678-7abc-8def-000000000001",
			"019b0000-0000-7000-8000-000000000000"
		]);
	});
});
