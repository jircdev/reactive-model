import { ReactiveModel } from '@beyond-js/reactive/model';
import { v4 as uuidv4 } from 'uuid';
import { IRegistry, RegistryId } from './types';

/**
 * Represents a single registry item.
 */
export class Registry<T> extends ReactiveModel<IRegistry> {
	#values: Record<keyof IRegistry, any>;
	#id: RegistryId;
	#isDeleted: boolean = false;
	__instanceId: RegistryId;

	get values(): Record<keyof IRegistry, any> {
		return this.#values;
	}

	get deleted(): boolean {
		return this.#isDeleted;
	}

	set deleted(value: boolean) {
		if (value === this.#isDeleted) return;
		this.#isDeleted = value;
		this.triggerEvent();
	}

	constructor(data: Partial<IRegistry> = { id: undefined }) {
		super();
		const { id } = data;
		this.#id = id ?? uuidv4();
		this.__instanceId = data.__instanceId ?? this.#id;
		this.#values = { ...data, id: this.#id } as Record<keyof IRegistry, any>;
		this.setValues(data);
	}

	private updateValue<K extends keyof IRegistry>(key: K, value: IRegistry[K]): void {
		(this.#values[key] as IRegistry[K]) = value;
	}

	setValues(data: Partial<IRegistry>): boolean {
		if (!data) return false;
		const props = Object.keys(data) as Array<keyof IRegistry>;
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

	getValues(): Record<keyof IRegistry, any> {
		return { ...this.#values, __instanceId: this.__instanceId };
	}
}
