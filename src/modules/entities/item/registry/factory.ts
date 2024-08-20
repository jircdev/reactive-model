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

	get(id: RegistryId<T>): Registry<T> {
		if (!id || !this.items.has(id)) {
			console.log('new registry for', this.#name, id, this.constructor.name, this.properties);

			const registry = new Registry<T>({ id, properties: this.properties } as Partial<RegistryData<T>>);
			id = registry.id;
			this.items.set(id, registry);
		}
		return this.items.get(id) as Registry<T>;
	}

	static getInstance<U>(entity: string, properties?): RegistryFactory<U> {
		if (!this.#instances.has(entity)) {
			this.#instances.set(entity, new RegistryFactory<U>(entity, properties));
		}
		return this.#instances.get(entity) as RegistryFactory<U>;
	}
}
