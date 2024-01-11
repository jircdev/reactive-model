import { ReactiveModel } from '@beyond-js/reactive/model';
import { PendingPromise } from '@beyond-js/kernel/core';
import { DBManager, DatabaseManager } from '@beyond-js/reactive/database';
import Dexie from 'dexie';
import { RegistryFactory } from '../../registry/factory';
import { LocalProviderSaver } from './saver';
import { LocalProviderLoader } from './loader';

interface IItemValues {
	[key: string]: any;
	offline: number;
	instanceId: string;
}
export /*bundle*/ class CollectionLocalProvider extends ReactiveModel<CollectionLocalProvider> {
	declare triggerEvent: (event?: string) => void;

	#isOnline = globalThis.navigator.onLine;

	#offline: boolean;
	#database!: DatabaseManager;
	#storeName!: string;
	#databaseName!: string;
	#loadManager: LocalProviderLoader;
	#exists = false;
	#found = false;
	#db: Dexie;
	#registryFactory: RegistryFactory;
	#parent;
	#saveManager: LocalProviderSaver;
	#bridge;
	#localdb: boolean;

	#apply: boolean = true;
	get apply() {
		return this.#apply;
	}

	#store!: Dexie.Table<any, any>;
	get store() {
		return this.#store;
	}
	/**
	 * Defines if the collection is using a local database or not.
	 */
	#active;
	get active() {
		return this.#active;
	}
	#items = [];
	get items() {
		return this.#items;
	}

	get isOnline() {
		return this.#isOnline && !this.#offline && !localStorage.getItem('reactive.offline');
	}

	constructor(parent, bridge: any) {
		super();
		const { db, storeName } = parent;
		this.#parent = parent;
		this.#bridge = bridge;
		this.localdb = this.#parent.localdb;

		if (!this.localdb) {
			this.#apply = false;
			return;
		}
		if (db) {
			this.#registryFactory = RegistryFactory.get(db);
		}

		this.#databaseName = db;
		this.#storeName = storeName;

		globalThis.addEventListener('online', this.handleConnection);
		globalThis.addEventListener('offline', this.handleConnection);

		this.#loadManager = new LocalProviderLoader(this, {
			store: this.#store,
			items: this.#items,
		});
	}

	setOffline(value) {
		this.#offline = value;
		this.triggerEvent();
	}
	#promiseInit: PendingPromise<void>;
	init = async () => {
		try {
			if (!this.#apply) {
				this.ready = true;
				return;
			}
			if (this.#promiseInit) return this.#promiseInit;
			this.#promiseInit = new PendingPromise();

			if (!this.#databaseName || !this.#storeName) {
				this.#active = false;
				this.#promiseInit.resolve();
				return;
			}

			const database: DatabaseManager = await DBManager.get(this.#databaseName);
			this.#database = database;
			this.#store = database.db[this.#storeName];
			if (!this.#store) {
				throw new Error(`The store ${this.#storeName} does not exists in the database ${this.#databaseName}`);
			}

			this.#saveManager = new LocalProviderSaver(this, {
				registryFactory: this.#registryFactory,
				storeName: this.#storeName,
				database: this.#database,
			});

			this.ready = true;
			this.#promiseInit.resolve();
		} catch (e) {
			console.error(e);
		}
	};

	private handleConnection = () => this.triggerEvent();

	/**
	 * @todo: Must validated if some item in the collection is not sync.
	 * @param data
	 * @returns
	 */
	#isUnpublished(data) {}

	async upsert(data: IItemValues[], originalData: any[]): Promise<void> {
		if (!this.#apply) return;
		return this.#database.db.transaction('rw', this.store, async () => {
			const instanceIdToIdMap = new Map<string, number>();
			data.forEach(item => {
				instanceIdToIdMap.set(item.instanceId, item.id);
			});

			await this.store.bulkPut(data);
		});
	}

	async softDelete(ids) {
		if (!this.#apply) return;
		if (!Array.isArray(ids)) {
			console.error('Expected an array of items for soft deletion');
			return { status: false, data: [] };
		}
		try {
			const records = await this.store.bulkGet(ids);
			const existingRecords = records.filter(record => record !== undefined);
			if (!existingRecords.length) return;
			// // Prepare items for bulk update
			const itemsToUpdate = existingRecords.map(record => ({ ...record, isDeleted: 1 }));
			// // Perform bulk update
			await this.#store.bulkPut(itemsToUpdate);

			return true;
		} catch (error) {
			console.error('Error occurred while performing a soft delete:', error);
			return { status: false, error: error.message };
		}
	}

	save = data => this.#saveManager.save(data);
	saveAll = (items, storeName) => this.#saveManager.saveAll(items, storeName);
	load = params => this.#loadManager.load(params);
}
