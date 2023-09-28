import { ReactiveModel } from '@beyond-js/reactive/model';
import { DBManager, DatabaseManager } from '@beyond-js/reactive/database';
import Dexie from 'dexie';
import { RegistryFactory } from '../registry/factory';
import type { Registry } from '../registry';
import { PendingPromise } from '@beyond-js/kernel/core';

export /*bundle*/
class LocalProvider extends ReactiveModel<any> {
	#isOnline = globalThis.navigator.onLine;
	#store!: Dexie.Table<any, any>;
	get store() {
		return this.#store;
	}

	#offline: boolean;
	#isNew: boolean = false;
	#database!: DatabaseManager;
	#storeName!: string;
	#databaseName!: string;
	#originalData: {};
	#exists = false;

	get originalData() {
		return this.#originalData;
	}

	#db: Dexie;

	get isOnline() {
		return this.#isOnline && !this.#offline && !localStorage.getItem('reactive.offline');
	}

	#parent;
	#getProperty;
	/**
	 * @type {RegistryFactory}
	 */
	#factoryRegistry: RegistryFactory;
	/**
	 * @type {Registry} Database Record
	 *
	 */
	#registry: Registry;
	#localdb: boolean;
	get localdb() {
		return this.#parent.localdb;
	}
	#bridge;

	get registry() {
		return this.#registry;
	}
	#apply: boolean;
	constructor(parent, bridge) {
		super();

		this.#getProperty = bridge.get;
		const { db, storeName } = parent;
		this.__id = Math.floor(Math.random() * (100000 - 1000 + 1)) + 1000;
		this.#parent = parent;
		this.#apply = db && storeName;
		this.#databaseName = db;
		this.#storeName = storeName;
		this.#bridge = bridge;
		this.#localdb = bridge.get('localdb');
		this.#factoryRegistry = RegistryFactory.get(db, this.#localdb);
		this.load = this.load.bind(this);
	}

	setOffline(value) {
		this.#offline = value;
		this.triggerEvent();
	}

	init = async (id: string | number | undefined = undefined) => {
		try {
			if (this.#localdb) {
				const database: DatabaseManager = await DBManager.get(this.#databaseName);
				this.#database = database;
				this.#store = database.db[this.#storeName];
			}

			this.#isNew = !!id;
			return this.#getRegistry(id);
		} catch (e) {
			console.error(e);
		}
	};

	/**
	 * todo: @jircdev replace with the model method
	 * @param data \
	 * @returns
	 */
	#isUnpublished(data) {
		const properties = Object.keys(data);
		const toCompare = { ...this.#registry.values };

		return properties.some(prop => {
			if (prop === 'id') return false;
			return toCompare[prop] !== data[prop];
		});
	}

	async load(params: any = {}) {
		try {
			let id = params.id;
			//TODO: review @julio
			id = id ?? this.registry.values?.id;

			// try {
			if (!id) throw 'ID IS REQUIRED';

			await this.#getRegistry(id);
			this.#parent.localLoaded = true;
			this.#parent.set(this.#registry.values);
			return { status: true, data: this.#registry.values };
		} catch (e) {
			console.error(e);
			return e;
		}
	}

	/**
	 * Retrieves the record from the local database store
	 *
	 * Also creates a listener for the record changes
	 * @param id id of the record
	 * @returns
	 */
	#getRegistry = async id => {
		let found = await this.#factoryRegistry.get(this.#storeName, id);
		let data = { id };
		if (!found && this.localdb && id) {
			const store = this.#store;
			const localData = await store.get(id);
			data = localData;
			found = true;
		}

		if (found) {
			this.#parent.found = found;
			this.#parent.loaded = true;
		}

		const registry = this.#factoryRegistry.create(this.#storeName, data);
		this.#registry = registry;
		this.#isNew = this.#registry?.values?.isNew ? true : false;
		return this.#registry.values;
	};

	async save(data) {
		try {
			if (!this.#isUnpublished(data)) return;
			data.offline = this.isOnline ? 0 : 1;
			data.isNew = !this.#isNew ? 0 : 1;
			// Add validation for unique fields
			const duplicated = await this.validateUniqueFields(data);

			if (duplicated.length) return { error: 'duplicated', fields: duplicated };

			await this.#update(data);

			return this;
		} catch (e) {
			console.error('error saving', e.message);
		}
	}

	async validateUniqueFields(data) {
		if (!this.localdb) return [];
		if (!this.#getProperty('unique').length) return [];

		const checkPromises = this.#getProperty('unique').map(field =>
			this.#store
				.where(field)
				.equals(data[field])
				.count()
				.then(count => {
					if (count) {
						return field;
					}
					return null;
				})
		);

		const duplicateFields = (await Promise.all(checkPromises)).filter(field => field !== null);
		return duplicateFields;
	}

	delete = async () => {
		const response = await this.#update({ isDeleted: 1 });

		return response;
	};

	async #update(data) {
		const updated = this.#registry.setValues(data);
		if (!updated) return;
		const store = this.#database.db[this.#storeName];
		const answer = await store.put(data);
		this.triggerEvent();
		return true;
	}
}
