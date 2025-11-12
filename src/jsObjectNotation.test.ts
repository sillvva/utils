import { fromJSObjectNotation, toJSObjectNotation } from "./jsObjectNotation";

describe("toJSObjectNotation", () => {
	it("converts simple path to dot notation", () => {
		expect(toJSObjectNotation(["user", "profile", "name"])).toBe("user.profile.name");
		expect(toJSObjectNotation(["a", "b", "c"])).toBe("a.b.c");
	});

	it("handles single segment", () => {
		expect(toJSObjectNotation(["user"])).toBe("user");
		expect(toJSObjectNotation(["items"])).toBe("items");
	});

	it("converts array indices to bracket notation", () => {
		expect(toJSObjectNotation(["items", 0])).toBe("items[0]");
		expect(toJSObjectNotation(["items", 0, "title"])).toBe("items[0].title");
		expect(toJSObjectNotation([0, "title"])).toBe("[0].title");
	});

	it("handles multiple array indices", () => {
		expect(toJSObjectNotation(["data", 0, "items", 1, "value"])).toBe("data[0].items[1].value");
		expect(toJSObjectNotation([0, 1, 2])).toBe("[0][1][2]");
	});

	it("uses bracket notation for invalid identifiers", () => {
		expect(toJSObjectNotation(["user", "full-name"])).toBe('user["full-name"]');
		expect(toJSObjectNotation(["user", "email-address"])).toBe('user["email-address"]');
		expect(toJSObjectNotation(["user", "123invalid"])).toBe('user["123invalid"]');
	});

	it("handles special characters with proper escaping", () => {
		expect(toJSObjectNotation(["user", 'name with "quotes"'])).toBe('user["name with \\"quotes\\""]');
		expect(toJSObjectNotation(["user", "path\\with\\backslashes"])).toBe('user["path\\\\with\\\\backslashes"]');
	});

	it("handles empty path", () => {
		expect(toJSObjectNotation([])).toBe("");
	});

	it("handles mixed valid and invalid identifiers", () => {
		expect(toJSObjectNotation(["user", "profile", "full-name", "age"])).toBe('user.profile["full-name"].age');
		expect(toJSObjectNotation(["data", 0, "user", "email-address"])).toBe('data[0].user["email-address"]');
	});
});

describe("fromJSObjectNotation", () => {
	it("parses simple dot notation", () => {
		expect(fromJSObjectNotation("user.profile.name")).toEqual(["user", "profile", "name"]);
		expect(fromJSObjectNotation("a.b.c")).toEqual(["a", "b", "c"]);
	});

	it("parses single identifier", () => {
		expect(fromJSObjectNotation("user")).toEqual(["user"]);
		expect(fromJSObjectNotation("items")).toEqual(["items"]);
	});

	it("parses array indices", () => {
		expect(fromJSObjectNotation("items[0]")).toEqual(["items", 0]);
		expect(fromJSObjectNotation("items[0].title")).toEqual(["items", 0, "title"]);
		expect(fromJSObjectNotation("[0].title")).toEqual([0, "title"]);
	});

	it("parses multiple array indices", () => {
		expect(fromJSObjectNotation("data[0].items[1].value")).toEqual(["data", 0, "items", 1, "value"]);
		expect(fromJSObjectNotation("[0][1][2]")).toEqual([0, 1, 2]);
	});

	it("parses bracket notation with strings", () => {
		expect(fromJSObjectNotation('user["full-name"]')).toEqual(["user", "full-name"]);
		expect(fromJSObjectNotation('user["email-address"]')).toEqual(["user", "email-address"]);
	});

	it("handles escaped characters in bracket notation", () => {
		expect(fromJSObjectNotation('user["name with \\"quotes\\""]')).toEqual(["user", 'name with "quotes"']);
		expect(fromJSObjectNotation('user["path\\\\with\\\\backslashes"]')).toEqual(["user", "path\\with\\backslashes"]);
	});

	it("handles single quotes in bracket notation", () => {
		expect(fromJSObjectNotation("user['full-name']")).toEqual(["user", "full-name"]);
		expect(fromJSObjectNotation("user['email-address']")).toEqual(["user", "email-address"]);
	});

	it("parses mixed notation", () => {
		expect(fromJSObjectNotation('user.profile["full-name"].age')).toEqual(["user", "profile", "full-name", "age"]);
		expect(fromJSObjectNotation('data[0].user["email-address"]')).toEqual(["data", 0, "user", "email-address"]);
	});

	it("handles empty string", () => {
		expect(fromJSObjectNotation("")).toEqual([]);
	});

	it("handles complex paths", () => {
		expect(fromJSObjectNotation("root[0].children[1].data[2].value")).toEqual(["root", 0, "children", 1, "data", 2, "value"]);
		expect(fromJSObjectNotation('config["api-url"].endpoints["v1"]')).toEqual(["config", "api-url", "endpoints", "v1"]);
	});
});

describe("round-trip conversion", () => {
	it("preserves simple paths", () => {
		const original = ["user", "profile", "name"];
		const notation = toJSObjectNotation(original);
		const parsed = fromJSObjectNotation(notation);
		expect(parsed).toEqual(original);
	});

	it("preserves paths with array indices", () => {
		const original = ["items", 0, "title"];
		const notation = toJSObjectNotation(original);
		const parsed = fromJSObjectNotation(notation);
		expect(parsed).toEqual(original);
	});

	it("preserves paths with special characters", () => {
		const original = ["user", "full-name", "age"];
		const notation = toJSObjectNotation(original);
		const parsed = fromJSObjectNotation(notation);
		expect(parsed).toEqual(original);
	});

	it("preserves complex mixed paths", () => {
		const original = ["data", 0, "user", "email-address"];
		const notation = toJSObjectNotation(original);
		const parsed = fromJSObjectNotation(notation);
		expect(parsed).toEqual(original);
	});

	it("preserves paths with escaped characters", () => {
		const original = ["user", 'name with "quotes"'];
		const notation = toJSObjectNotation(original);
		const parsed = fromJSObjectNotation(notation);
		expect(parsed).toEqual(original);
	});

	it("preserves paths starting with array index", () => {
		const original = [0, "title", "value"];
		const notation = toJSObjectNotation(original);
		const parsed = fromJSObjectNotation(notation);
		expect(parsed).toEqual(original);
	});
});
