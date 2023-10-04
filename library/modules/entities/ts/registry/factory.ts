import { ReactiveModel } from '@beyond-js/reactive/model';
import { Registry } from './index';
import { PendingPromise } from '@beyond-js/kernel/core';
import { DBManager, DatabaseManager } from '@beyond-js/reactive/database';

interface IRecords {
	stores: Map<string, Map<string, Registry>>;
}
/**
 *
 */
export class /*bundle*/ RegistryFactory extends ReactiveModel<IRecords> {
	#stores = new Map();

	#dbName;
	#localdb;
	constructor(dbName, localdb = true) {
		super();
		this.#dbName = dbName;
		this.#localdb = localdb;
		this.init();
	}

	#promiseReady: PendingPromise<any>;
	async init() {
		if (this.ready) return true;
		if (this.#promiseReady) return this.#promiseReady;
		this.#promiseReady = new PendingPromise();

		this.#promiseReady.resolve();
		this.#promiseReady = undefined;
		this.ready = true;
	}

	/**
	 * Loop a list of items and if they don't exist in memorey, create the registry and add it to the store.
	 * @param storeName
	 * @param items
	 */
	registerList(storeName, items) {
		const registries = items.map(item => {
			if (this.hasItem(storeName, item.id)) {
				return this.getItem(storeName, item.id);
			}

			return this.create(storeName, item);
		});
	}

	/**
	 * Validates if the specified item exists in the specified store.
	 *
	 *  This method is used by the LocalProvider to know if a item was already loaded or not.
	 *  If the item is not loaded, the LocalProvider will load it from the database and pass the data to the Factory
	 *  to create the registry in memory
	 * @param storeName store name
	 * @param id Id of the item to validate if exists or is loaded
	 * @returns
	 */
	hasItem(storeName, id) {
		return this.#stores.has(storeName) && this.#stores.get(storeName).has(id);
	}

	getItem(storeName, id) {
		if (!this.hasItem(storeName, id)) throw new Error(`Item ${id} does not exists in store ${storeName}`);
		return this.#stores.get(storeName).get(id);
	}

	#getStore(store) {
		if (!this.#stores.has(store)) this.#stores.set(store, new Map());
		return this.#stores.get(store);
	}

	create(storeName, data) {
		const registry = new Registry(storeName, data);
		registry.setValues(data);
		this.#getStore(storeName).set(registry.values.id, registry);
		return registry;
	}

	async get(storeName: string, id = undefined) {
		// if the store map does not exists, create it
		if (!this.#stores.has(storeName)) this.#stores.set(storeName, new Map());
		// if the registry exists, return it
		if (this.#stores.has(storeName) && this.#stores.get(storeName).has(id)) {
			const registry = this.#stores.get(storeName).get(id);
			return registry;
		}
	}

	async has(storeName, id) {
		if (this.#stores.has(storeName) && this.#stores.get(storeName).has(id)) return true;
	}

	static #dbs = new Map();

	/**
	 * Returns a RegistryFactory instance for the specified database name.
	 *
	 * @param dbName IndexedDB database name
	 * @returns
	 */
	static get(dbName, localdb?) {
		if (this.#dbs.has(dbName)) return this.#dbs.get(dbName);
		const db = new RegistryFactory(dbName, localdb);
		this.#dbs.set(dbName, db);
		return db;
	}
}
