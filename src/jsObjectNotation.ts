/**
 * Converts a path array to JavaScript object notation string.
 * @module
 */

/**
 * Converts a path array to JavaScript object notation string.
 *
 * @param path - An array of strings and numbers representing a path to a property
 * @returns A JavaScript object notation string (e.g., "user.profile.name" or "items[0].title")
 *
 * @example Basic usage with dot notation
 * import { toJSObjectNotation } from "@sillvva/utils";
 *
 * const path = ["user", "profile", "name"];
 * const notation = toJSObjectNotation(path);
 * console.log(notation); // "user.profile.name"
 *
 * @example With array indices
 * import { toJSObjectNotation } from "@sillvva/utils";
 *
 * const path = ["items", 0, "title"];
 * const notation = toJSObjectNotation(path);
 * console.log(notation); // "items[0].title"
 *
 * @example With special characters requiring bracket notation
 * import { toJSObjectNotation } from "@sillvva/utils";
 *
 * const path = ["user", "full-name", "age"];
 * const notation = toJSObjectNotation(path);
 * console.log(notation); // 'user["full-name"].age'
 *
 * @example Complex path with mixed notation
 * import { toJSObjectNotation } from "@sillvva/utils";
 *
 * const path = ["data", 0, "user", "email-address"];
 * const notation = toJSObjectNotation(path);
 * console.log(notation); // 'data[0].user["email-address"]'
 */
export function toJSObjectNotation(path: Array<string | number>): string {
	let result = "";

	for (let i = 0; i < path.length; i++) {
		const segment = path[i];

		if (typeof segment === "number") {
			result += `[${segment}]`;
		} else if (typeof segment === "string") {
			// Valid identifier that can use dot notation
			if (/^[a-z_$][\w$]*$/i.test(segment)) {
				result += i === 0 ? segment : `.${segment}`;
			} else {
				// Use bracket notation with proper escaping
				const escaped = segment.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
				result += `["${escaped}"]`;
			}
		}
	}

	return result;
}

/**
 * Parses a JavaScript object notation string into a path array.
 *
 * @param notation - A JavaScript object notation string (e.g., "user.profile.name" or "items[0].title")
 * @returns An array of strings and numbers representing the path
 *
 * @example Basic usage with dot notation
 * import { fromJSObjectNotation } from "@sillvva/utils";
 *
 * const notation = "user.profile.name";
 * const path = fromJSObjectNotation(notation);
 * console.log(path); // ["user", "profile", "name"]
 *
 * @example With array indices
 * import { fromJSObjectNotation } from "@sillvva/utils";
 *
 * const notation = "items[0].title";
 * const path = fromJSObjectNotation(notation);
 * console.log(path); // ["items", 0, "title"]
 *
 * @example With bracket notation for special characters
 * import { fromJSObjectNotation } from "@sillvva/utils";
 *
 * const notation = 'user["full-name"].age';
 * const path = fromJSObjectNotation(notation);
 * console.log(path); // ["user", "full-name", "age"]
 *
 * @example Round-trip conversion
 * import { toJSObjectNotation, fromJSObjectNotation } from "@sillvva/utils";
 *
 * const original = ["data", 0, "user", "email-address"];
 * const notation = toJSObjectNotation(original);
 * const parsed = fromJSObjectNotation(notation);
 * console.log(parsed); // ["data", 0, "user", "email-address"]
 */
export function fromJSObjectNotation(notation: string): Array<string | number> {
	const path: Array<string | number> = [];
	let i = 0;

	while (i < notation.length) {
		// Handle bracket notation
		if (notation[i] === "[") {
			i++; // Skip opening bracket

			// Check if it's a number or string
			if (notation[i] === '"' || notation[i] === "'") {
				const quote = notation[i];
				i++; // Skip opening quote
				let segment = "";

				// Read until closing quote, handling escapes
				while (i < notation.length && notation[i] !== quote) {
					if (notation[i] === "\\" && i + 1 < notation.length) {
						// Handle escape sequence
						i++;
						segment += notation[i];
					} else {
						segment += notation[i];
					}
					i++;
				}

				i++; // Skip closing quote
				path.push(segment);
			} else {
				// It's a number
				let numStr = "";
				while (i < notation.length && notation[i] !== "]") {
					numStr += notation[i];
					i++;
				}
				path.push(parseInt(numStr, 10));
			}

			i++; // Skip closing bracket
		}
		// Handle dot notation
		else if (notation[i] === ".") {
			i++; // Skip dot
		}
		// Handle identifier at start or after dot
		else {
			let segment = "";
			while (i < notation.length && notation[i] !== "." && notation[i] !== "[") {
				segment += notation[i];
				i++;
			}
			if (segment) {
				path.push(segment);
			}
		}
	}

	return path;
}
