import { ReactiveModel } from '@beyond-js/reactive/model';
import { IRegistry } from './types';
import { Registry } from './';

/**
 * Factory for managing multiple registry instances.
 */
export /*bundle */ class RegistryFactory<T> extends ReactiveModel<RegistryFactory<T>> {
	#registries: Map<string, Map<IRegistry['id'], Registry<T>>> = new Map();
	static #instances: Map<string, RegistryFactory<any>> = new Map();

	constructor() {
		super();
		this.ready = true;
	}

	has(store: string, id?: IRegistry['id']): boolean {
		return this.#registries.has(store) && this.#registries.get(store)!.has(id!);
	}

	get(store: string, id: IRegistry['id']): Registry<T> {
		if (!this.has(store, id)) throw new Error(`Item ${id} does not exist in store ${store}`);
		return this.#registries.get(store)!.get(id)!;
	}

	create(store: string, data: Partial<T>): Registry<T> {
		const registry = new Registry<T>(data as T);
		if (!this.#registries.has(store)) {
			this.#registries.set(store, new Map());
		}

		return registry;
	}

	static get<U>(key: string): RegistryFactory<U> {
		if (!this.#instances.has(key)) {
			this.#instances.set(key, new RegistryFactory<U>());
		}
		return this.#instances.get(key) as RegistryFactory<U>;
	}
}
