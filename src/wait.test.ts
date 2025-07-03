import { createSpy } from "./test-helpers";
import { wait } from "./wait";

describe("wait", () => {
	it("resolves after the specified delay", async () => {
		const start = Date.now();
		await wait(100);
		const elapsed = Date.now() - start;
		if (elapsed < 90) throw new Error(`Expected at least 90ms, got ${elapsed}`);
	});

	it("can be used for sequential delays", async () => {
		const fn = createSpy((x: number | string) => {});
		async function countdown() {
			for (let i = 3; i > 0; i--) {
				fn(i);
				await wait(10);
			}
			fn("Go!");
		}
		await countdown();
		if (fn.callCount() !== 4) throw new Error(`Expected 4 calls, got ${fn.callCount()}`);
		const lastCall = fn.lastCall();
		if (!lastCall || lastCall[0] !== "Go!") throw new Error(`Expected last call with 'Go!', got ${lastCall && lastCall[0]}`);
	});
});
