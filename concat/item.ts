export interface IRegistry {
	id?: string | number;
	__instanceId?: string | number;
	[key: string]: any;
}

export type RegistryId = IRegistry['id'];

export interface IRegistryFactory<T, Record> {
	registries: Map<string, Map<RegistryId, Record>>;
}

/**
 * File: factory.ts
 */
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

/**
 * File: index.ts
 */
import { ReactiveModel } from '@beyond-js/reactive/model';
import { v4 as uuidv4 } from 'uuid';
import { IRegistry, RegistryId } from './types';

/**
 * Represents a single registry item.
 */
export class Registry<T> extends ReactiveModel<IRegistry> {
	#values: Record<keyof IRegistry, any>;
	/**
	 * Unique identifier for the registry item, it does not represent the record entity id
	 */
	#id: RegistryId;
	get id() {
		return this.#id;
	}
	#isDeleted: boolean = false;
	#instanceId: RegistryId;
	get instanceId() {
		return this.#instanceId;
	}

	get values(): Record<keyof IRegistry, any> {
		return this.#values;
	}

	get deleted(): boolean {
		return this.#isDeleted;
	}

	set deleted(value: boolean) {
		if (value === this.#isDeleted) return;
		this.#isDeleted = value;
		this.triggerEvent();
	}

	constructor(data: Partial<IRegistry> = { id: undefined }) {
		super();
		const { id } = data;
		this.#instanceId = uuidv4();
		this.#id = id ?? this.#instanceId;

		this.#values = { ...data, id: this.#id } as Record<keyof IRegistry, any>;
		this.set(data);
	}

	private updateValue<K extends keyof IRegistry>(key: K, value: IRegistry[K]): void {
		(this.#values[key] as IRegistry[K]) = value;
	}

	setValues(data: Partial<IRegistry>): boolean {
		if (!data) return false;
		const props = Object.keys(data) as Array<keyof IRegistry>;
		let updated = false;

		props.forEach(property => {
			if (data[property] === this.#values[property]) return;
			this.updateValue(property, data[property] as T[keyof T]);
			updated = true;
		});

		if (updated) {
			this.trigger('change', { values: this.#values });
		}
		return updated;
	}

	getValues(): Record<keyof IRegistry, any> {
		return { ...this.#values };
	}
}

/**
 * File: store.ts
 */
import { ReactiveModel } from '@beyond-js/reactive/model';

interface IStoreRecords {}
export class /*bundle */ StoreRecords extends ReactiveModel<IStoreRecords> {}

const storeFactory = new StoreRecords();

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
		this.#factory = RegistryFactory.getInstance(entity);
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
export type IItemProps<T> = Partial<ReactiveProps<T>> & {
	id?: ItemId;
	entity?: string; // Making 'entity' optional
};
