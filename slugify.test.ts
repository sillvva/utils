import { slugify } from "./slugify";

describe("slugify", () => {
	it("converts text to slug", () => {
		expect(slugify("Hello World")).toBe("hello-world");
		expect(slugify("  Multiple   Spaces  ")).toBe("multiple-spaces");
		expect(slugify("Special!@# Chars")).toBe("special-chars");
	});

	it("removes accents", () => {
		expect(slugify("Café")).toBe("cafe");
		expect(slugify("naïve façade")).toBe("naive-facade");
	});

	it("handles empty string", () => {
		expect(slugify("")).toBe("");
	});

	it("removes duplicate dashes", () => {
		expect(slugify("a--b")).toBe("a-b");
		expect(slugify("a    b")).toBe("a-b");
	});
});
