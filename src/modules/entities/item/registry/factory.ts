import { ReactiveModel } from '@beyond-js/reactive/model';
import { Registry } from './';
import { RegistryId } from './types';

/**
 * Factory for managing multiple registry instances.
 */
export /*bundle */ class RegistryFactory<T> extends ReactiveModel<RegistryFactory<T>> {
	static #instances: Map<string, RegistryFactory<any>> = new Map();
	items: Map<RegistryId, Registry> = new Map();

	#name: string;

	constructor(name: string, properties: any) {
		super({ properties });
		this.#name = name;
		this.ready = true;
	}

	getItem(id: RegistryId, data: any): Registry {
		if (!id || !this.items.has(id)) {
			const specs = data ? { id, ...data } : { id, properties: this.properties, ...data };
			const registry = new Registry(this.#name, specs);
			registry.on('record.published', registry => {
				this.trigger('record.published', registry);
			});
			registry.on('record.updated', registry => this.trigger('update.registry', registry));
			registry.on('record.deleted', registry => this.trigger('record.deleted', registry));
			id = registry.id;
			this.items.set(id, registry);
		}

		const item = this.items.get(id) as Registry;
		if (data) {
			let specs = data;
			if (!data.id) {
				delete specs.id;
			}

			item.setValues(data);
		}

		return item;
	}

	static getInstance<T>(entity: string, data?: any) {
		if (!this.#instances.has(entity)) {
			this.#instances.set(entity, new RegistryFactory<T>(entity, data));
		}
		return this.#instances.get(entity) as RegistryFactory<T>;
	}
}
