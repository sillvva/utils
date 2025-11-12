# sillvva-utils

A module containing general purpose utility functions and types.

## Installation

```bash
npm install @sillvva/utils
```

## Usage Examples

### Abortable Promise

```typescript
import { AbortablePromise } from "@sillvva/utils";

const promise = new AbortablePromise(
	(resolve, reject) => {
		setTimeout(() => {
			resolve("Hello World");
		}, 1000);
	},
	{ signal: AbortSignal.timeout(500) }
);

promise
	.then((result) => {
		console.log(result); // Hello World
	})
	.catch((error) => {
		console.log(error); // Error: The operation was aborted.
	});
```

### Debounce

```typescript
import { debounce } from "@sillvva/utils";

const debouncedSearch = debounce((query: string) => {
	console.log("Searching for:", query);
	return `Results for ${query}`;
}, 300);

// Only the last call executes after 300ms
debouncedSearch.call("hello").then((result) => {
	console.log(result); // "Results for hello"
});
```

### deepEqual

```typescript
import { deepEqual } from "@sillvva/utils";

// Deep compare of primitives, arrays, objects, maps, sets, dates, and regexps:
console.log(deepEqual({ a: 1, b: [2, 3] }, { b: [2, 3], a: 1 })); // true
console.log(deepEqual([1, 2, 3], [1, 2, 3])); // true
console.log(deepEqual(new Set([1, 2]), new Set([2, 1]))); // true
console.log(deepEqual(new Map([["x", 1]]), new Map([["x", 1]]))); // true

// Not equal when structure or values differ:
console.log(deepEqual({ foo: 1 }, { foo: 2 })); // false
```

### isDefined

```typescript
import { isDefined } from "@sillvva/utils";

const values = [1, null, 2, undefined, 3]; // (number | null | undefined)[]
const defined = values.filter(isDefined); // number[]
console.log(defined); // [1, 2, 3]
```

### isInstanceOfClass

```typescript
import { isInstanceOfClass } from "@sillvva/utils";

class User {
	constructor(public name: string) {}
}

const user = new User("John");
const plainObj = { name: "Jane" };

// Check specific class
console.log(isInstanceOfClass(user, User)); // true
console.log(isInstanceOfClass(plainObj, User)); // false

// Check for any class instance
console.log(isInstanceOfClass(user)); // true
console.log(isInstanceOfClass(plainObj)); // false

// Type narrowing
function processUser(data: unknown) {
	if (isInstanceOfClass(data, User)) {
		console.log(data.name); // TypeScript knows data is User
	}
}
```

### isOneOf

```typescript
import { isOneOf } from "@sillvva/utils";

// before ❌
function checkFruits(fruit: string) {
	if (["apple", "banana", "orange"].includes(fruit)) {
		console.log(fruit); // string
	}
}

// after ✅
function checkFruits(fruit: string) {
	if (isOneOf(fruit, ["apple", "banana", "orange"])) {
		console.log(fruit); // "apple" | "banana" | "orange"
	}
}
```

### JS Object Notation

```typescript
import { toJSObjectNotation, fromJSObjectNotation } from "@sillvva/utils";

// Convert path array to notation string
const path = ["user", "profile", "name"];
const notation = toJSObjectNotation(path);
console.log(notation); // "user.profile.name"

// With array indices
const path2 = ["items", 0, "title"];
const notation2 = toJSObjectNotation(path2);
console.log(notation2); // "items[0].title"

// Special characters use bracket notation
const path3 = ["user", "full-name", "age"];
const notation3 = toJSObjectNotation(path3);
console.log(notation3); // 'user["full-name"].age'

// Parse notation string back to path array
const parsed = fromJSObjectNotation("user.profile.name");
console.log(parsed); // ["user", "profile", "name"]

// Round-trip conversion
const original = ["data", 0, "user", "email-address"];
const notation4 = toJSObjectNotation(original);
const parsed2 = fromJSObjectNotation(notation4);
console.log(parsed2); // ["data", 0, "user", "email-address"]
```

### Omit

```typescript
import { omit } from "@sillvva/utils";

const user = { id: 1, name: "Jane", email: "jane@example.com" };
const safe = omit(user, ["email"]);
console.log(safe); // { id: 1, name: "Jane" }

// Strongly typed keys
type User = { id: number; name: string; email: string };
const u: User = { id: 1, name: "Jane", email: "jane@example.com" };
const withoutEmail = omit(u, ["email"] as const);
// withoutEmail is typed as { id: number; name: string }
```

### Slugify

```typescript
import { slugify } from "@sillvva/utils";

const slug = slugify("Hello World");
console.log(slug); // hello-world
```

### Sorter

```typescript
import { sorter } from "@sillvva/utils";

const fruits = ["apple", "Banana", "Orange", "banana"];
const sorted = fruits.toSorted(sorter);
console.log(sorted); // ["apple", "banana", "Banana", "Orange"]

const arrObjs = [{ id: 3 }, { id: 1 }, { id: 2 }];
const sortedObjs = arrObjs.toSorted((a, b) => sorter(a.id, b.id));
console.log(sortedObjs); // [{ id: 1 }, { id: 2 }, { id: 3 }]
```

### Substring Count

```typescript
import { substrCount } from "@sillvva/utils";

const text = "hello world hello";
const count = substrCount(text, "hello");
console.log(count); // 2

// With overlapping matches
const overlapping = substrCount("aaaa", "aa", true);
console.log(overlapping); // 3
```

### Wait

```typescript
import { wait } from "@sillvva/utils";

async function example() {
	console.log("Starting...");
	await wait(1000);
	console.log("1 second later!");
}
```

### Utility Types

```typescript
import type { MapKeys, Prettify, Falsy, DictOrArray } from "@sillvva/utils";

// MapKeys - Extract key type from Map
type MyMap = Map<string, number>;
type Keys = MapKeys<MyMap>; // string

// Prettify - Flatten intersection types
type Ugly = { a: string } & { b: number };
type Pretty = Prettify<Ugly>; // { a: string; b: number }

// Falsy - Type guard for falsy values
function isFalsy(value: unknown): value is Falsy {
	return !value;
}

// DictOrArray - Handle objects or arrays
function processData(data: DictOrArray) {
	if (Array.isArray(data)) {
		console.log("Processing array with", data.length, "items");
	} else {
		console.log("Processing object with keys:", Object.keys(data));
	}
}
```
