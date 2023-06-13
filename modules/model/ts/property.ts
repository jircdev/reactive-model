import type { ReactiveModel } from ".";
function _defineReactiveProp<T>(target: ReactiveModel<T>, propKey: keyof T, initialValue: T[keyof T]): void {
	const privatePropKey = `__${String(propKey)}`;

	Object.defineProperty(target, propKey, {
		get(): T[keyof T] {
			if (!target.hasOwnProperty(privatePropKey)) {
				target[privatePropKey] = initialValue;
			}
			return target[privatePropKey];
		},
		set(newVal: T[keyof T]): void {
			if (newVal === target[privatePropKey]) return;
			target[privatePropKey] = newVal;
			target.triggerEvent();
		},
		enumerable: true,
		configurable: true,
	});
}
export /*bundle */ function reactiveProps<T>(
	props: Array<keyof T>
): (target: { new (...args: any[]): ReactiveModel<T> } | { prototype: ReactiveModel<T> }) => void {
	return function (target: { new (...args: any[]): ReactiveModel<T> } | { prototype: ReactiveModel<T> }): void {
		const targetProto = "prototype" in target ? target.prototype : target;

		for (const propKey of props) {
			const descriptor = Object.getOwnPropertyDescriptor(targetProto, propKey);
			const initialValue = descriptor ? descriptor.value : undefined;

			defineReactiveProp(targetProto, propKey, initialValue);
		}
	};
}

export function defineReactiveProp<T>(target: ReactiveModel<T>, propKey: keyof T, initialValue: T[keyof T]): void {
	const privatePropKey = `__${String(propKey)}`;

	Object.defineProperty(target, propKey, {
		get(): T[keyof T] {
			if (!target.hasOwnProperty(privatePropKey)) {
				target[privatePropKey] = initialValue;
			}
			return target[privatePropKey];
		},
		set(newVal: T[keyof T]): void {
			target.setReactiveProp(propKey, newVal);
		},
		enumerable: true,
		configurable: true,
	});
}
