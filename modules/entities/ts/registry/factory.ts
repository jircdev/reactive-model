import { ReactiveModel } from '@beyond-js/reactive-2/model';
import { Registry } from './index';
import { PendingPromise } from '@beyond-js/kernel/core';
import { DBManager, DatabaseManager } from '@beyond-js/reactive-2/database';

interface IRecords {
	stores: Map<string, Map<string, Registry>>;
}
export class /*bundle*/ FactoryRecords extends ReactiveModel<IRecords> {
	#stores = new Map();
	#database;

	// async get({ db, store, filter: { id } }): Promise<boolean | Registry> {
	// 	const database = this.#databases.get(db) ?? (await DBManager.get(db));
	// 	this.#databases.set(db, database);

	// 	if (!database.db[store]) {
	// 		console.warn("Store does not exists");
	// 		return;
	// 	}
	// 	const key = `${db}.${store}`;
	// 	if (this.stores.has(key) && this.stores.get(key).has(id)) return this.stores.get(key).get(id);

	// 	const registry = new Registry(db, store, id, {});
	// 	await registry.load();

	// 	await database.db[store].get(id);

	// 	if (this.stores.has(store) && this.stores.get(store).has(id)) return this.stores.get(store).get(id);

	// 	const promise = new PendingPromise();
	// 	await this.load(store, id);
	// 	this.stores.set(store, new Map([[id, promise]]));

	// 	if (!this.stores.has(store) || !this.stores.get(store).has(id)) return false;
	// 	return this.stores.get(store).get(id);
	// }

	// async load(store, id) {
	// 	const record = await this.#database.db[store].get(id);
	// }

	// update(store, id, data) {
	// 	if (!this.stores.has(store)) this.stores.set(store, new Map());
	// 	if (!this.stores.get(store).has(id)) {
	// 		this.stores.get(store).set(id, new Registry(store, id, data));
	// 	} else {
	// 		this.stores.get(store).get(id).update(data);
	// 	}
	// 	return this.stores.get(store).get(id);
	// }

	// setDatabase(database) {
	// 	this.#database = database;
	// }

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

	async load(storeName, id) {
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

	static #dbs = new Map();

	static get(dbName) {
		if (this.#dbs.has(dbName)) return this.#dbs.get(dbName);
		const db = new FactoryRecords(dbName);
		this.#dbs.set(dbName, db);
		return db;
	}
}
