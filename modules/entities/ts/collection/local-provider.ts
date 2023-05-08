import { ReactiveModel } from '@beyond-js/reactive-2/model';

import { IProvider } from '../interfaces/provider';
import { liveQuery } from 'dexie';
import { PendingPromise } from '@beyond-js/kernel/core';
import { DBManager, DatabaseManager } from '@beyond-js/reactive-2/database';
import Dexie from 'dexie';
import { FactoryRecords } from '../registry/factory';

interface IItemValues {
	[key: string]: any;
	offline: number;
	instanceId: string;
}
export /*bundle*/ class CollectionLocalProvider extends ReactiveModel<IProvider> {
	#isOnline = globalThis.navigator.onLine;
	#store!: Dexie.Table<any, any>;
	get store() {
		return this.#store;
	}
	#offline: boolean;
	#database!: DatabaseManager;
	#storeName!: string;
	#databaseName!: string;
	#items = [];
	#records: FactoryRecords;
	get items() {
		return this.#items;
	}
	#exists = false;
	#found = false;

	#db: Dexie;
	get isOnline() {
		return this.#isOnline && !this.#offline && !localStorage.getItem('reactive.offline');
	}
	#parent;
	constructor(parent, bridge) {
		super();
		const { db, storeName } = parent;
		this.#parent = parent;
		this.#records = FactoryRecords.get(db);

		if (!db || !storeName) throw new Error('database and store are required');
		this.#databaseName = db;
		this.#storeName = storeName;

		globalThis.addEventListener('online', this.handleConnection);
		globalThis.addEventListener('offline', this.handleConnection);
	}

	setOffline(value) {
		this.#offline = value;
		this.triggerEvent();
	}
	#promiseInit: PendingPromise<void>;
	init = async () => {
		try {
			if (this.#promiseInit) return this.#promiseInit;
			this.#promiseInit = new PendingPromise();

			const database: DatabaseManager = await DBManager.get(this.#databaseName);
			this.#database = database;
			this.#store = database.db[this.#storeName];
			this.ready = true;
			this.#promiseInit.resolve();
			this.#promiseInit = undefined;
		} catch (e) {
			console.error(e);
		}
	};

	private handleConnection = () => {
		this.triggerEvent();
	};

	/**
	 * @todo: Must validated if some item in the collection is not sync.
	 * @param data
	 * @returns
	 */
	#isUnpublished(data) {}
	#promiseLoad: PendingPromise<any>;
	#params;
	async load(params) {
		if (JSON.stringify(this.#params) === JSON.stringify(params)) {
			if (this.#promiseLoad) return this.#promiseLoad;
			return;
		}

		const conditions = Object.keys(params);
		const controls = ['and', 'or'];
		conditions.forEach((condition) => {
			if (controls.includes(condition)) {
				this.#processControl(condition, params[condition]);
			}
		});

		try {
			const live = liveQuery(() => this.#store.toArray());
			live.subscribe({
				next: (items) => {
					if (this.#promiseLoad) {
						this.#promiseLoad.resolve(items);
						this.#promiseLoad = null;
					}

					this.#items = items;
					this.trigger('items.changed');
				},
				error: (err) => {
					console.error(err);
				},
			});

			//return await this.live.toArray();
		} catch (error) {
			console.error('Error al cargar los elementos del store:', error);
			return [];
		}
	}

	async save(data): Promise<any> {
		if (!this.isOnline) data = data.map((item) => ({ ...item, offline: 1 }));
		console.log(1, data);

		await this.#records.init();
		await this.#records.saveAll(data, this.#storeName);
	}
	#processControl(control, conditions) {
		this.#store[control];
	}

	async upsert(data: IItemValues[], originalData: any[]): Promise<void> {
		return this.#database.db.transaction('rw', this.store, async () => {
			const instanceIdToIdMap = new Map<string, number>();
			data.forEach((item) => {
				instanceIdToIdMap.set(item.instanceId, item.id);
			});

			await this.store.bulkPut(data);
		});
	}
}
