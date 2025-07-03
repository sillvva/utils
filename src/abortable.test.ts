import { AbortablePromise } from "./abortable";

describe("AbortablePromise", () => {
	it("resolves as expected", async () => {
		const promise = new AbortablePromise<string>((resolve) => {
			setTimeout(() => resolve("done"), 10);
		});
		await expect(promise).resolves.toBe("done");
	});

	it("rejects when aborted", async () => {
		const controller = new AbortController();
		const promise = new AbortablePromise<string>(
			(resolve) => {
				setTimeout(() => resolve("done"), 50);
			},
			{ signal: controller.signal }
		);
		setTimeout(() => controller.abort("aborted"), 10);
		await expect(promise).rejects.toBe("aborted");
	});
});
