import { ReactiveModel, ModelProperties } from '@beyond-js/reactive/model';
import { v4 as uuidv4 } from 'uuid';
import { RegistryData, RegistryDataValue } from './types';

export class Registry<T> extends ReactiveModel<RegistryData<T>> {
	#id: RegistryData<T>['id'];
	#instanceId: RegistryData<T>['id'];
	#isDeleted: boolean = false;

	get id() {
		return this.#id;
	}

	get instanceId() {
		return this.#instanceId;
	}

	#values: RegistryData<T>;
	get values(): RegistryData<T> {
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

	constructor(data: Partial<RegistryData<T>> = { id: undefined } as RegistryData<T>) {
		super({ properties: data.properties || [] });
		const { id } = data;
		this.#instanceId = uuidv4();
		this.#id = id ?? this.#instanceId;

		this.#values = { ...data, id: this.#id } as RegistryData<T>;
		this.set(data);
	}

	private updateValue<K extends keyof RegistryDataValue<T>>(key: K, value: RegistryDataValue<T>[K]): void {
		this.#values[key] = value;
	}

	setValues(data: Partial<RegistryDataValue<T>>): boolean {
		if (!data) return false;

		let updated = false;

		for (const key in data) {
			if (Object.prototype.hasOwnProperty.call(data, key)) {
				// @ts-ignore
				const property = key as keyof RegistryDataValue<T>;
				// @ts-ignore
				const value = data[property] as RegistryDataValue<T>[typeof property];

				// Skip if the value is the same
				// @ts-ignore
				if (value === this.#values[property]) continue;

				this.updateValue(property, value);
				updated = true;
			}
		}

		if (updated) {
			this.trigger('change', { values: this.#values });
		}
		return updated;
	}

	getValues(): ModelProperties<T> {
		return { ...this.#values };
	}
}
