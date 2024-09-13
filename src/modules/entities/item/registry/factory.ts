import { ReactiveModel } from '@beyond-js/reactive/model';
import { RegistryData, RegistryId } from './types';
import { Registry } from './';

/**
 * Factory for managing multiple registry instances.
 */
export /*bundle */ class RegistryFactory<T> extends ReactiveModel<RegistryFactory<T>> {
	static #instances: Map<string, RegistryFactory<any>> = new Map();
	items: Map<RegistryId<T>, Registry<T>> = new Map();

	#name: string;

	constructor(name, properties) {
		super({ properties });
		this.#name = name;
		this.ready = true;
	}

	get(id: RegistryId<T>, data?: Partial<T>): Registry<T> {
		console.log(99, this, id, data, this.items);
		if (!id || !this.items.has(id)) {
			console.log('new registry for', this.#name, id, this.constructor.name, this.properties);
			const specs = data ? { ...data } : { id, properties: this.properties, ...data };
			const registry = new Registry<T>(specs as Partial<RegistryData<T>>);

			id = registry.id;
			this.items.set(id, registry);
		}

		const item = this.items.get(id) as Registry<T>;
		if (data) item.setValues(data);

		return item;
	}

	static getInstance<U>(entity: string, data?): RegistryFactory<U> {
		if (!this.#instances.has(entity)) {
			this.#instances.set(entity, new RegistryFactory<U>(entity, data));
		}
		return this.#instances.get(entity) as RegistryFactory<U>;
	}
}
