/**
 * Creates a promise that resolves after a specified number of milliseconds
 * @module
 */

/**
 * Creates a promise that resolves after a specified number of milliseconds
 * @param ms The number of milliseconds to wait
 * @returns A promise that resolves after the specified delay
 * 
 * @example Basic usage
 * import { wait } from "@sillvva/utils";
 * 
 * async function example() {
 *   console.log("Starting...");
 *   await wait(1000);
 *   console.log("1 second later!");
 * }
 * 
 * @example Sequential delays
 * import { wait } from "@sillvva/utils";
 * 
 * async function countdown() {
 *   for (let i = 3; i > 0; i--) {
 *     console.log(i);
 *     await wait(1000);
 *   }
 *   console.log("Go!");
 * }
 */
export function wait(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}