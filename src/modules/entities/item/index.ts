import { RegistryData } from './registry/types/index';
import { ReactiveModel, ReactiveProps, SetPropertiesResult } from '@beyond-js/reactive/model';
import { IItemProps } from './types';
import { RegistryFactory } from './registry/factory';
import { Registry } from './registry';

export /*bundle*/ abstract class Item<T> extends ReactiveModel<T> {
	#factory: RegistryFactory<T>;
	declare id: RegistryData<T>['id'];
	protected static entity: string;
	#registry: Registry<T>;

	constructor({ entity, ...args }: IItemProps<T>) {
		super({ ...args } as ReactiveProps<T>);
		if (!entity) throw new Error('Entity is required');
		this.#factory = RegistryFactory.getInstance<T>(entity, args.properties);
		const registry = this.#factory.get(this.id);
		this.#registry = registry;
		
		this.setInitialValues(registry.getValues());
		this.#registry.on('change', this.registryListener.bind(this));
	}

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

	// Define optional methods with a default implementation that gives a warning message
	load?() {
		console.warn(`${this.constructor.name}: 'load' method is not implemented.`);
	}

	save?() {
		console.warn(`${this.constructor.name}: 'save' method is not implemented.`);
	}

	publish?() {
		console.warn(`${this.constructor.name}: 'publish' method is not implemented.`);
	}

	delete?() {
		console.warn(`${this.constructor.name}: 'delete' method is not implemented.`);
	}
}
