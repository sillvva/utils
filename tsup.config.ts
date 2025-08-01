import { defineConfig } from "tsup";

export default defineConfig({
	entry: {
		index: "src/entry.ts"
	},
	format: ["cjs", "esm"],
	dts: true,
	splitting: false,
	sourcemap: true,
	clean: true
});
