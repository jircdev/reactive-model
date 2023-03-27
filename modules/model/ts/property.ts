import type { ReactiveModel } from ".";

export function reactiveProp<T>(target: ReactiveModel<T>, propKey: string): void {
	let val: T[keyof T] = target[propKey];

	Object.defineProperty(target, propKey, {
		get(): T[keyof T] {
			return val;
		},
		set(newVal: T[keyof T]): void {
			if (newVal === val) return;
			val = newVal;
			target.triggerEvent();
		},
		enumerable: true,
		configurable: true,
	});
}

export function reactiveProps<T>(props: Array<keyof T>): (target: ReactiveModel<T>, propKey: string) => void {
	return function (target: ReactiveModel<T>, propKey: string): void {
		if (!props.includes(propKey as keyof T)) return;
		reactiveProp(target, propKey);
	};
}
