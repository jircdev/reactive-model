import { ReactiveModel } from '@beyond-js/reactive/model';
import { liveQuery } from 'dexie';
import { PendingPromise } from '@beyond-js/kernel/core';
import { DBManager, DatabaseManager } from '@beyond-js/reactive/database';
import Dexie from 'dexie';
import { RegistryFactory } from '../../registry/factory';
import { LocalProviderSaver } from './saver';

interface IItemValues {
	[key: string]: any;
	offline: number;
	instanceId: string;
}
export /*bundle*/ class CollectionLocalProvider extends ReactiveModel<any> {
	#isOnline = globalThis.navigator.onLine;

	#batches = 200;
	#offline: boolean;
	#database!: DatabaseManager;
	#storeName!: string;
	#databaseName!: string;
	#listItems = new Map();
	#exists = false;
	#found = false;
	#ids = new Set();
	#db: Dexie;
	#registryFactory: RegistryFactory;
	#parent;
	#bridge;
	#localdb: boolean;
	/**
	 *
	 */
	#apply: boolean = true;
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
			this.ready = true;
			this.#promiseInit.resolve();
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

	#total;
	#page = 0;

	#customWhere;
	#defaultWhere = store => store.orderBy('id');

	#currentLimit;
	#currentOffset;
	where = (params, limit) => {
		return async () => {
			let store = this.#store;
			const { sortBy, sortDirection } = params;
			const offset = (this.#page - 1) * limit;
			const specs = { ...params };
			Object.keys(specs).forEach(key => {
				['and', 'or', 'limit', 'sortBy', 'sortDirection'].includes(key) && delete specs[key];
			});

			let collection = Object.keys(specs).length === 0 ? store : store.where(specs);

			//const filter = this.#customWhere ?? this.#defaultWhere;

			this.#currentLimit = limit;
			this.#currentOffset = offset;
			/**
			 * @todo: the isDeleted field must be set as 0 by default.
			 */

			if (sortBy) {
				await collection.sortBy(sortBy);
			}
			collection = collection.filter(i => i.isDeleted !== 1);

			return collection
				.offset(offset)
				.limit(limit)

				.toArray();
		};
	};

	customFilter = callback => {
		this.#customWhere = callback;
		return this.#parent;
	};
	#cantidad = 0;
	async load(params) {
		if (!this.#apply) return;
		if (this.#promiseLoad) return this.#promiseLoad;
		if (JSON.stringify(this.#params) === JSON.stringify(params)) {
			return this.#promiseLoad;
		}
		this.#promiseLoad = new PendingPromise();
		await this.init();
		const conditions = Object.keys(params);
		const controls = ['and', 'or'];

		conditions.forEach(condition => {
			if (controls.includes(condition)) {
				this.#processControl(condition, params[condition]);
			}
		});

		try {
			if (!this.#total) this.#total = await this.#store.count();
			let limit = params.limit ?? 30;
			const totalPages = Math.ceil(this.#total / limit);

			if (totalPages < this.#page) return;
			let first = true;
			const live = liveQuery(this.where(params, limit));
			this.#page++;
			let currentPage;

			live.subscribe({
				next: async items => {
					let sameQuery;
					this.#cantidad++;
					items.forEach(item => {
						// console.log(item.id, item.role, item.content?.substring(0, 40));
					});

					if (params.sortBy) {
						items.sort((a, b) => {
							return a[params.sortBy] - b[params.sortBy];
						});
					}

					if (!globalThis.data) globalThis.data = [];
					//globalThis.data.push([...items]);

					if (currentPage == this.#page) {
						sameQuery = true;
					} else {
						currentPage = this.#page;
					}

					if (sameQuery && items.length === this.#parent.items.length) {
						return;
					}

					const currentMap = new Set();
					items.forEach(item => {
						this.#listItems.set(item.id, item);
						currentMap.add(item.id);
					});
					if (sameQuery) {
						[...this.#listItems.keys()].forEach(id => {
							if (!currentMap.has(id)) {
								this.#listItems.delete(id);
							}
						});
					}
					this.#items = [...this.#listItems.values()];

					items.forEach(item => this.#ids.add(item.id));
					this.trigger('items.changed');

					if (this.#promiseLoad) {
						first = false;

						const response = { status: true, data: items, total: this.#total, next: true };
						if (this.#page + 1 >= totalPages) delete response.next;
						this.#promiseLoad.resolve(response);
						this.#promiseLoad = null;
					}
				},
				error: err => {
					console.error(err);
				},
			});
			return this.#promiseLoad;
			//return await this.live.toArray();
		} catch (error) {
			console.error('Error al cargar los elementos del store:', error);
			return { status: false, data: [] };
		}
	}

	#processControl(control, conditions) {
		this.#store[control];
	}

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
}
