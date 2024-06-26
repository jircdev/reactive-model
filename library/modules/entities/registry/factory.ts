import { ReactiveModel } from '@beyond-js/reactive/model';
import { IRegistry } from './types';
import { Registry } from './';

/**
 * Factory for managing multiple registry instances.
 */
export class RegistryFactory<T extends IRegistry> extends ReactiveModel<{
	registries: Map<string, Map<IRegistry['id'], Registry<T>>>;
}> {
	#registries: Map<string, Map<IRegistry['id'], Registry<T>>> = new Map();
	static #instances: Map<string, RegistryFactory<any>> = new Map();

	constructor() {
		super();
		this.ready = true;
	}

	registerList(store: string, items: Partial<T>[]): void {
		items.forEach(item => {
			if (this.has(store, item.id)) {
				this.get(store, item.id!);
			} else {
				this.create(store, item);
			}
		});
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
		this.#registries.get(store)!.set(registry.values.id as string, registry);
		return registry;
	}

	static getInstance<T extends IRegistry>(): RegistryFactory<T> {
		if (!this.#instances.has('default')) {
			const instance = new RegistryFactory<T>();
			this.#instances.set('default', instance);
		}
		return this.#instances.get('default')! as RegistryFactory<T>;
	}
}
