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
	get registry() {
		return this.#registry;
	}
	constructor({ entity, properties, ...args }: IItemProps<T>) {
		super({ ...args, properties } as ReactiveProps<T>);
		if (!entity) throw new Error('Entity is required');

		this.#factory = RegistryFactory.getInstance<T>(entity);

		const registry = this.#factory.get(this.id, args as Partial<T>);
		this.#registry = registry;

		const propertyValues = registry.getValues();
		this.setInitialValues(propertyValues);
		this.#registry.on('change', this.registryListener.bind(this));

		this.properties.forEach((property: keyof T) => {
			// TODO: capability to support object type properties.
			if (typeof property === 'string') {
				this.on(`${property}.changed`, () => {
					this.#registry.setValues({ [property]: this.getProperty(property) } as Partial<T>);
				});
			}
		});
	}

	private registryListener(values) {
		super.set(this.#registry.getValues());
	}

	set(values: T): SetPropertiesResult {
		console.log(44, values);
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
