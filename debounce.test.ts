import { debounce } from "./debounce";
import { createSpy } from "./test-helpers";
import { wait } from "./wait";

describe("debounce", () => {
	it("delays execution and returns result", async () => {
		const fn = createSpy((x: number) => x * 2);
		const debounced = debounce(fn, 50);
		const promise = debounced.call(2);
		if (fn.callCount() !== 0) throw new Error("Function called too early");
		await wait(60);
		const result = await promise;
		if (result !== 4) throw new Error(`Expected 4, got ${result}`);
		if (fn.callCount() !== 1) throw new Error("Function should be called once");
		const lastCall = fn.lastCall();
		if (!lastCall || lastCall[0] !== 2) throw new Error("Function called with wrong argument");
	});

	it("only calls the last call", async () => {
		const fn = createSpy((x: string) => x);
		const debounced = debounce(fn, 50);
		debounced.call("a");
		debounced.call("b");
		const promise = debounced.call("c");
		await wait(60);
		const result = await promise;
		if (result !== "c") throw new Error(`Expected 'c', got ${result}`);
		if (fn.callCount() !== 1) throw new Error("Function should be called once");
		const lastCall = fn.lastCall();
		if (!lastCall || lastCall[0] !== "c") throw new Error("Function called with wrong argument");
	});

	it("cancels execution", async () => {
		const fn = createSpy(() => {});
		const debounced = debounce(fn, 50);
		debounced.call("x");
		debounced.cancel();
		await wait(60);
		if (fn.callCount() !== 0) throw new Error("Function should not be called after cancel");
	});
});
