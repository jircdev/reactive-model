import { ReactiveModel } from '@beyond-js/reactive/model';
import { DBManager, DatabaseManager } from '@beyond-js/reactive/database';
import Dexie, { Collection, Table } from 'dexie';
import { RegistryFactory } from '../registry/factory';
import type { Registry } from '../registry';
import { PendingPromise } from '@beyond-js/kernel/core';

export /*bundle*/
class LocalProvider extends ReactiveModel<any> {
	#isOnline = globalThis.navigator.onLine;
	#store!: Table<any, any>;
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
	__instanceId: string;
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
	deepCompare(obj1, obj2) {
		const keys1 = Object.keys(obj1);
		const keys2 = Object.keys(obj2);

		if (keys1.length !== keys2.length) {
			return false;
		}

		for (let key of keys1) {
			const val1 = obj1[key];
			const val2 = obj2[key];

			const areObjects = this.isObject(val1) && this.isObject(val2);
			if ((areObjects && !this.deepCompare(val1, val2)) || (!areObjects && val1 !== val2)) {
				return false;
			}
		}

		return true;
	}
	isObject(object) {
		return object != null && typeof object === 'object';
	}
	/**
	 * todo: @jircdev replace with the model method
	 * @param data \
	 * @returns
	 */
	#isUnpublished(data) {
		const properties = Object.keys(data);
		const toCompare = { ...this.#registry.values };
		const areEqual = this.deepCompare(toCompare, data);

		return !areEqual;
	}

	async load(params: any = {}) {
		try {
			let id = params.id;
			//TODO: review @julio
			id = id ?? this.registry.values?.id;

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
		let registry = await this.#factoryRegistry.get(this.#storeName, id);
		let data = { id };
		let found = !!registry;

		if (found) {
			this.#parent.set(registry.values);
			found = true;
			this.#registry = registry;
			this.#registry.on('change', this.#listenRegistry.bind(this));
			this.#isNew = this.#registry?.values?.isNew ? true : false;
			return;
		}

		if (!registry && this.localdb && id) {
			const store = this.#store;
			const localData = await store.get(id);
			if (localData) data = localData;
			found = true;
		}

		if (found) {
			this.#parent.found = found;
			this.#parent.loaded = true;
		}

		registry = this.#factoryRegistry.create(this.#storeName, data);
		this.#registry = registry;
		this.#registry.on('change', this.#listenRegistry.bind(this));
		this.#isNew = this.#registry?.values?.isNew ? true : false;
		return this.#registry.values;
	};

	#listenRegistry() {
		this.#parent.set(this.#registry.values);
	}
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
		if (!this.#database) return;
		const response = await this.#update({ isDeleted: 1 });

		return response;
	};

	deleteRegistry = async identifier => {
		const store = this.#database.db[this.#storeName];
		await store.delete(identifier);
		this.triggerEvent();
		return true;
	};

	async #update(data) {
		const updated = this.#registry.setValues(data);
		if (!updated) return;
		const store = this.#database.db[this.#storeName];
		await store.put({ ...this.#registry.values, ...data });
		this.triggerEvent();
		return true;
	}
}
