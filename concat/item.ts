/**
 * File: index.ts
 */
import { ReactiveModel, ReactiveProps, SetPropertiesResult } from '@beyond-js/reactive/model';

import { IItemProps, ItemId } from './types';
import { RegistryFactory } from './registry/factory';
import { Registry } from './registry';

//your code here
export /*bundle*/ abstract class Item<T> extends ReactiveModel<T> {
	#factory: RegistryFactory<T>;
	declare id: string | number;
	protected static entity: string;
	#registry: Registry<T>;

	constructor({ entity, ...args }: IItemProps<T>) {
		super({ ...args } as ReactiveProps<T>);
		if (!entity) throw new Error('Entity is required');
		this.#factory = RegistryFactory.getInstance(entity, args.properties);
		const registry = this.#factory.get(this.id);
		this.#registry = registry;
		this.setInitialValues(registry.getValues());
		this.#registry.on('change', this.registryListener.bind(this));
	}

	/**
	 * This method is called when the registry changes and updates the model values to match the registry values and keep them in sync.
	 * @param values
	 */
	private registryListener(values) {
		super.set(this.#registry.getValues());
	}
	set(values: T): SetPropertiesResult {
		const response = super.set(values);
		if (response.updated) {
			this.#registry.setValues(values);
		}
		return response;
	}

	abstract load();
	abstract save();
	abstract publish();
	abstract delete();
}

/**
 * File: types.ts
 */
import { ReactiveProps } from '@beyond-js/reactive/model';

export type ItemId = string | number;
export /*bundle*/ type IItemProps<T> = Partial<ReactiveProps<T>> & {
	id?: ItemId;
	entity?: string; // Making 'entity' optional
};

