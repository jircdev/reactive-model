import { ReactiveModel } from '@beyond-js/reactive/model';
import { v4 as uuidv4 } from 'uuid';
import { IRegistry } from './IRegistry';

/**
 * Represents a single registry item.
 */
export class Registry<T extends IRegistry> extends ReactiveModel<T> {
	#values: T;
	#id: IRegistry['id'];
	#isDeleted: boolean = false;
	__instanceId: string;

	get values(): T {
		return this.#values;
	}

	get isDeleted(): boolean {
		return this.#isDeleted;
	}

	set isDeleted(value: boolean) {
		if (value === this.#isDeleted) return;
		this.#isDeleted = value;
		this.triggerEvent();
	}

	constructor(data: T = { id: undefined } as T) {
		super();
		const { id } = data;
		this.#id = id ?? uuidv4();
		this.__instanceId = data.__instanceId ?? this.#id;
		this.#values = { ...data, id: this.#id } as T;
		this.setValues(data);
	}

	private updateValue<K extends keyof T>(key: K, value: T[K]): void {
		(this.#values[key] as T[K]) = value;
	}

	setValues(data: Partial<T>): boolean {
		if (!data) return false;
		const props = Object.keys(data) as Array<keyof T>;
		let updated = false;

		props.forEach(property => {
			if (data[property] === this.#values[property]) return;
			this.updateValue(property, data[property] as T[keyof T]);
			updated = true;
		});

		if (updated) {
			this.triggerEvent();
		}
		return updated;
	}

	getValues(): T {
		return { ...this.#values, __instanceId: this.__instanceId };
	}
}
