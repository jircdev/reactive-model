/**
 * File: index.ts
 */
import { ReactiveModel, SetPropertiesResult } from '@beyond-js/reactive/model';
import { Registry } from './registry';
import { RegistryFactory } from './registry/factory';
import { IEntityProvider, IItem, IItemProps } from './types';

export /*bundle*/ class Item<T extends IItem, P extends IEntityProvider = IEntityProvider> extends ReactiveModel<T> {
	#factory: RegistryFactory<T>;

	#entity: string;
	get entity() {
		return this.#entity;
	}

	#registry: Registry;

	get __registryState() {
		return this.#registry.state;
	}
	#fetched: boolean;
	get fetched() {
		return this.#fetched;
	}

	#found: boolean = false;
	get found() {
		return this.#found;
	}
	protected _provider: P;

	get provider() {
		return this._provider;
	}
	get registry() {
		return this.#registry;
	}

	get __instanceId() {
		return this.#registry.instanceId;
	}
	#draft: boolean;
	get draft() {
		return this.#draft;
	}
	declare deleted: boolean;

	constructor({ entity, provider, properties, ...args }: Partial<IItemProps<T, P>> = {}) {
		super({ ...args, properties });
		// if (this.constructor.name === 'Assignment')

		if (!entity) throw new Error('Entity is required');

		if (provider && typeof provider !== 'function') {
			throw new Error(`Provider must be a class/constructor in object ${entity}`);
		}

		this.reactiveProps(['deleted']);
		this.#entity = entity;

		this.onSet = this.onSet.bind(this);
		/**
		 * This event is triggered when the set method is executed.
		 */
		this.on('set.executed', this.onSet);

		if (provider) {
			this._provider = new provider(this);
		}

		this.#factory = RegistryFactory.getInstance(entity);

		this.initialize(args);
	}
	/**
	 *
	 * @param param0
	 */
	protected initialize({ ...args }) {
		const registry = this.#factory.getItem(this.getProperty('id'), args);
		this.#registry = registry;

		const propertyValues = this.#registry.getValues();

		this.setInitialValues(propertyValues);
		// this.#registry.on('change', this.registryListener.bind(this));

		this.properties.forEach(property => {
			// TODO: capability to support object type properties.
			if (typeof property === 'string') {
				this.on(`${property}.changed`, () => {
					this.#registry.setValues({ [property]: this.getProperty(property) });
				});
			}
		});
	}

	set(values: any): SetPropertiesResult {
		const response = super.set(values);
		return response;
	}

	onSet() {
		this.#registry?.setValues(this.getProperties());
	}

	protected _load(args: any) {}
	// Define optional methods with a default implementation that gives a warning message
	async load(args?: any) {
		if (!this.provider || typeof this.provider.load !== 'function') {
			throw new Error(
				`DataProvider is not defined or does not implement the load() method in object ${this.constructor.name}`,
			);
		}

		try {
			const response = await this.provider.load(args);

			const data = response;
			if (!data) {
				this.#found = false;
				throw new Error('Provider.load() did not return an item.');
			}
			this.#found = true;
			this.#fetched = true;

			this.set(data);

			this.triggerEvent('load', { ...this.getProperties() });
			this.trigger('change');

			return response;
		} catch (e) {
			this.#found = false;
			throw e;
		}
	}

	async publish(data?: any) {
		data = data ? data : this.getProperties();

		this.set({ ...this.getProperties(), ...data });
		this.#registry.setValues(this.getProperties, true);
		super.saveChanges();

		if (this.provider && typeof this.provider.publish === 'function') {
			const updated = await this.provider.publish(data);

			if (!updated.status) {
				throw new Error('Error saving item');
			}
			this.set(updated.data);
			return updated.data;
		}
		return this.getProperties();
	}

	async delete(id) {
		try {
			id = id ?? this.getProperty('id');
			if (!this.provider || typeof this.provider.delete !== 'function') {
				throw new Error('DataProvider is not defined or does not implement the delete() method.');
			}
			this.processing = true;
			this.#registry.deleted = true;
			return this.provider.delete(id);
			return true;
		} catch (e) {
			console.error(e);
		}
	}
}

/**
 * File: registry\factory.ts
 */
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

/**
 * File: registry\index.ts
 */
import { ReactiveModel } from '@beyond-js/reactive/model';
import { v4 as uuidv4 } from 'uuid';

export class Registry extends ReactiveModel<Registry> {
	#id: any;
	#instanceId: any;
	#isDeleted: boolean = false;

	#draft: boolean = false;

	#state: 'draft' | 'published' | 'deleted' = 'draft';
	get state() {
		return this.#state;
	}
	get draft() {
		return this.#draft;
	}
	set draft(value: boolean) {
		if (value === this.#draft) return;
		this.#draft = value;
		this.triggerEvent();
	}

	get id() {
		return this.#id || this.#values.id;
	}

	get instanceId() {
		return this.#instanceId;
	}

	#values: any;
	get values() {
		return this.#values;
	}

	get deleted(): boolean {
		return this.#isDeleted;
	}

	set deleted(value: boolean) {
		if (value === this.#isDeleted) return;
		this.#isDeleted = value;

		this.trigger('record.deleted', this.#values);
		this.triggerEvent();
	}
	#entity: string;

	constructor(entity, { properties, ...data } = { id: undefined, properties: [], instanceId: undefined }) {
		super({ properties: properties || [] });

		this.#entity = entity;
		const { id } = data;
		this.#instanceId = data?.instanceId ? data.instanceId : uuidv4();

		this.#id = id;
		this.#draft = !id;
		this.#values = { ...data, id: this.#id };
		this.#state = this.#id ? 'published' : 'draft';
		this.setValues(this.#values);
	}

	private updateValue(key, value): void {
		this.#values[key] = value;
	}

	setValues(data, published = false): boolean {
		if (!data) return false;
		const baseState = this.#state;
		if (published) this.#state = 'published';
		let updated = false;

		for (const key in data) {
			if (Object.prototype.hasOwnProperty.call(data, key)) {
				const property = key;
				const value = data[property];
				if (value === this.#values[property]) continue;

				this.updateValue(property, value);
				updated = true;
			}
		}

		if (baseState !== this.#state && this.#state === 'published') {
			this.trigger('record.published', { ...this.#values });
			return updated;
		}
		if (!updated) return updated;

		this.trigger('change', { values: this.#values });
		this.trigger('record.updated', { ...this.#values });

		return updated;
	}

	getValues() {
		return { ...this.#values };
	}
}

/**
 * File: registry\types\index.ts
 */
export type RegistryId = string | number;
export type ReactiveProperty<T> = keyof T | { name: keyof T };
export type RegistryData<T> = {
	id?: string | number;
	instanceId?: string;
	properties: ReactiveProperty<T>[];
};

/**
 * File: types.ts
 */
import type { Item } from './index';

export /*bundle*/ interface IItem {
	id: string | number;
}
export /*bundle*/ type ItemId = string | number;
export type ReactiveProperty<T> = keyof T | { name: keyof T };
export /*bundle*/ interface IItemProps<T, P extends IEntityProvider> {
	id?: ItemId;
	provider: new (parent: any) => P;
	entity: string;
	properties: any;
}

export interface IItemProviderResponse<T> {
	status: number;
	data?: T;
	error?: string;
	errors?: Array<{
		field: string;
		message: string;
	}>;
}
export /*bundle*/ interface IEntityProvider {
	load?(specs?: any): Promise<any>;
	list?(specs?: any): Promise<any>;
	// save?(data: any): Promise<any>;
	publish?(data: any): Promise<any>;
	remove?(specs: any): Promise<any>;
	delete?(specs?: any): Promise<any>;
}

export /*bundle*/ type IRecordProps<T> = {
	id: ItemId;
	properties: Array<ReactiveProperty<T>>;
	[key: string]: any;
};

