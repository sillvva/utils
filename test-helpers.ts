// Manual spy implementation for Bun compatibility
export function createSpy<T extends (...args: any[]) => any>(fn: T) {
	const calls: any[][] = [];
	const spy = (...args: Parameters<T>): ReturnType<T> => {
		calls.push(args);
		return fn(...args);
	};
	spy.calls = calls;
	spy.callCount = () => calls.length;
	spy.lastCall = () => calls[calls.length - 1];
	return spy as T & {
		calls: any[][];
		callCount: () => number;
		lastCall: () => any[] | undefined;
	};
}
