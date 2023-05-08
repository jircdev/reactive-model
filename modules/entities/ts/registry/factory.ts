import { ReactiveModel } from "@beyond-js/reactive-2/model";
import { Registry } from "./index";
import { PendingPromise } from "@beyond-js/kernel/core";
import { DBManager, DatabaseManager } from "@beyond-js/reactive-2/database";

interface IRecords {
	stores: Map<string, Map<string, Registry>>;
}
export class /*bundle*/ FactoryRecords extends ReactiveModel<IRecords> {
	#stores = new Map();
	#database;
	#batches = 200;
	#dbName;
	constructor(dbName) {
		super();
		this.#dbName = dbName;
		this.init();
	}

	#promiseReady: PendingPromise<any>;
	async init() {
		if (this.ready) return true;
		if (this.#promiseReady) return this.#promiseReady;
		this.#promiseReady = new PendingPromise();
		this.#database = await DBManager.get(this.#dbName);

		this.#promiseReady.resolve();
		this.#promiseReady = undefined;
		this.ready = true;
	}

	async load(storeName, id = "new") {
		const store = this.#database.db[storeName];
		if (!store) throw new Error(`Store ${storeName} does not exists`);
		// if the store map does not exists, create it
		if (!this.#stores.has(storeName)) this.#stores.set(storeName, new Map());
		// if the registry exists, return it
		if (this.#stores.has(storeName) && this.#stores.get(storeName).has(id)) {
			const registry = this.#stores.get(storeName).get(id);
			return registry.get();
		}

		/**
		 * the local parameter defines if the registry is being creating as new local item in local or not
		 */

		const registry = new Registry(store, { id });
		await registry.get();

		this.#stores.get(storeName).set(registry.instanceId, registry);

		return registry;
	}

	/**
	 * Saves a collection of items to the specified store in batches.
	 *
	 * @param {Array} items - The items to be saved.
	 * @param {string} storeName - The name of the store where items will be saved.
	 * @returns {Promise<{ status: boolean, failed?: Array }>} An object containing the status of the operation.
	 * If the status is true, all batches have been saved successfully. If the status is false, the failed property contains an array with information about failed batches.
	 * Each failed batch object has a status, a reason (if the batch is rejected), an index (the original batch position), and data (the failed batch data).
	 * @throws Will throw an error if there's an issue with the Promise.allSettled() call itself.
	 */

	async saveAll(items, storeName) {
		const elements = items.map(item => {
			const registry = new Registry(storeName);
			registry.setValues(item);
			return registry;
		});

		const store = this.#database.db[storeName];
		const promises = [];
		const chunks = [];
		while (elements.length > 0) {
			const batch = elements.splice(0, this.#batches);
			const data = batch.map(item => item.getValues());
			chunks.push(data);
			promises.push(store.bulkPut(data));
		}
		try {
			const results = await Promise.allSettled(promises);
			const mappedFn = (result, index) => ({ ...result, index, data: chunks[index] });
			const failed = results.map(mappedFn).filter(result => result.status === "rejected");
			if (!failed.length) return { status: true };
			else {
				return { status: false, failed };
			}
		} catch (e) {
			return { status: false, failed: e };
		}
	}

	static #dbs = new Map();

	static get(dbName) {
		if (this.#dbs.has(dbName)) return this.#dbs.get(dbName);
		const db = new FactoryRecords(dbName);
		this.#dbs.set(dbName, db);
		return db;
	}
}
