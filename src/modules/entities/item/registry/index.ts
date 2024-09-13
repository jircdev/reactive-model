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

	#values: T;
	get values(): T {
		return this.#values;
	}

	get deleted(): boolean {
		return this.#isDeleted;
	}

	#propertyNames: string[] = [];

	set deleted(value: boolean) {
		if (value === this.#isDeleted) return;
		this.#isDeleted = value;
		this.triggerEvent();
	}

	constructor({ properties, ...data }: Partial<RegistryData<T>> = { id: undefined } as RegistryData<T>) {
		super({ properties: properties || [] });

		const { id } = data;
		this.#instanceId = uuidv4();
		this.#id = id ?? this.#instanceId;

		this.#values = { ...data, id: this.#id } as RegistryData<T>;
		this.setValues(data as T);
	}

	private updateValue<K extends keyof T>(key: K, value: T[K]): void {
		this.#values[key] = value;
	}

	setValues(data: Partial<T>): boolean {
		if (!data) return false;

		let updated = false;

		for (const key in data) {
			if (Object.prototype.hasOwnProperty.call(data, key)) {
				const property = key as keyof T;
				const value = data[property] as T[typeof property];
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
		console.log(111, this.#values);
		return { ...this.#values };
	}
}
