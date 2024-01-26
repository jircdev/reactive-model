import type { ReactiveModel } from './';
import { ReactiveProperties } from './interfaces/types';

export class ModelProperties {
	#parent;

	#items = new Set();
	multipleSet: boolean;
	#reactiveProperties = ['fetching', 'fetched', 'processing', 'processed', 'loaded', 'ready'];
	get items() {
		return [...this.#items];
	}
	hasChanges: boolean;

	constructor(parent) {
		this.#parent = parent;
	}
	reactiveProps(props: ReactiveProperties): void {
		if (!props) return;
		for (const propKey of props) {
			if (typeof propKey === 'object') {
				console.log(`the props is an object`, propKey);
				continue;
			}
			if (!this.#reactiveProperties.includes(propKey)) {
				this.#items.add(propKey);
			}
			const descriptor = Object.getOwnPropertyDescriptor(this.#parent, propKey);
			const initialValue = descriptor ? descriptor.value : undefined;

			this.defineReactiveProp(propKey, initialValue);
		}
	}

	protected defineReactiveProp<T>(propKey: keyof T, initialValue: T[keyof T]): void {
		const privatePropKey = `__${String(propKey)}`;

		Object.defineProperty(this.#parent, propKey, {
			enumerable: true,
			configurable: true,
			get: (): T[keyof T] => {
				if (!this.hasOwnProperty(privatePropKey)) {
					this[privatePropKey] = initialValue;
				}
				return this[privatePropKey];
			},
			set: (newVal: T[keyof T]) => {
				const sameObject =
					typeof newVal === 'object' && JSON.stringify(newVal) === JSON.stringify(this[privatePropKey]);

				if (this[privatePropKey] === newVal || sameObject) return;

				this.hasChanges = true;
				this[privatePropKey] = newVal;

				if (this.multipleSet === false) this.#parent.triggerEvent();
			},
		});
	}
}
