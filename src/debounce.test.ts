import { debounce } from "./debounce";
import { createSpy } from "./test-helpers";
import { wait } from "./wait";

describe("debounce", () => {
	it("delays execution and returns result with 1 argument", async () => {
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

	it("works with 0 arguments", async () => {
		const fn = createSpy(() => 42);
		const debounced = debounce(fn, 50);
		const promise = debounced.call();
		if (fn.callCount() !== 0) throw new Error("Function called too early");
		await wait(60);
		const result = await promise;
		if (result !== 42) throw new Error(`Expected 42, got ${result}`);
		if (fn.callCount() !== 1) throw new Error("Function should be called once");
		const lastCall = fn.lastCall();
		if (!lastCall || lastCall.length !== 0) throw new Error("Function should be called with no arguments");
	});

	it("works with 2 arguments", async () => {
		const fn = createSpy((a: number, b: string) => `${a}-${b}`);
		const debounced = debounce(fn, 50);
		const promise = debounced.call(10, "test");
		if (fn.callCount() !== 0) throw new Error("Function called too early");
		await wait(60);
		const result = await promise;
		if (result !== "10-test") throw new Error(`Expected '10-test', got ${result}`);
		if (fn.callCount() !== 1) throw new Error("Function should be called once");
		const lastCall = fn.lastCall();
		if (!lastCall || lastCall.length !== 2) throw new Error("Function should be called with 2 arguments");
		if (lastCall[0] !== 10 || lastCall[1] !== "test") throw new Error("Function called with wrong arguments");
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
		debounced.call();
		debounced.cancel();
		await wait(60);
		if (fn.callCount() !== 0) throw new Error("Function should not be called after cancel");
	});
});
