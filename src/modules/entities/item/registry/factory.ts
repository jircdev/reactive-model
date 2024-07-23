import { ReactiveModel } from '@beyond-js/reactive/model';
import { IRegistry, RegistryId } from './types';
import { Registry } from './';

/**
 * Factory for managing multiple registry instances.
 */
export /*bundle */ class RegistryFactory<T> extends ReactiveModel<RegistryFactory<T>> {
	static #instances: Map<string, RegistryFactory<any>> = new Map();
	items: Map<RegistryId, Registry<T>> = new Map();
	#name: string;
	constructor(name) {
		super();
		this.#name = name;
		this.ready = true;
	}

	get(id: RegistryId): Registry<T> {
		if (!id || !this.items.has(id)) {
			console.log('new registry for', this.#name, id);
			const registry = new Registry<T>({ id });
			id = registry.id;
			this.items.set(id, registry);
		}
		return this.items.get(id) as Registry<T>;
	}

	static getInstance<U>(key: string): RegistryFactory<U> {
		if (!this.#instances.has(key)) {
			this.#instances.set(key, new RegistryFactory<U>(key));
		}
		return this.#instances.get(key) as RegistryFactory<U>;
	}
}
