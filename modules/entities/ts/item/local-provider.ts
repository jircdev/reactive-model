import { ReactiveModel } from '@beyond-js/reactive-2/model';
import { IProvider } from '../interfaces/provider';
import { PendingPromise } from '@beyond-js/kernel/core';
import { DBManager, DatabaseManager } from '@beyond-js/reactive-2/database';
import Dexie from 'dexie';
import { FactoryRecords } from '../registry/factory';
import type { Registry } from '../registry';
export /*bundle*/
class LocalProvider extends ReactiveModel<any> {
	#isOnline = globalThis.navigator.onLine;
	#store!: Dexie.Table<any, any>;
	get store() {
		return this.#store;
	}

	#offline: boolean;
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
	 * @type {FactoryRecords}
	 */
	#records: FactoryRecords;
	/**
	 * @type {Registry} Database Record
	 *
	 */
	#registry: Registry;

	get registry() {
		return this.#registry;
	}
	constructor(parent, getProperty) {
		super();

		this.#getProperty = getProperty;
		const { db, storeName } = parent;
		this.__id = Math.floor(Math.random() * (100000 - 1000 + 1)) + 1000;
		this.#parent = parent;

		if (!db || !storeName) throw new Error('database and store are required');
		this.#databaseName = db;
		this.#storeName = storeName;
		this.#records = FactoryRecords.get(db);
		globalThis.addEventListener('online', this.handleConnection);
		globalThis.addEventListener('offline', this.handleConnection);
	}

	setOffline(value) {
		this.#offline = value;
		this.triggerEvent();
	}

	init = async (id: string | number | undefined = undefined) => {
		try {
			const database: DatabaseManager = await DBManager.get(this.#databaseName);
			this.#database = database;
			this.#store = database.db[this.#storeName];

			await this.#getRegistry(id);
			if (id) await this.load({ id });

			return;
		} catch (e) {
			console.error(e);
		}
	};

	private handleConnection = () => {
		this.triggerEvent();
	};

	isUnpublished(data) {
		const properties = Object.keys(data);
		const toCompare = { ...this.#registry.values };

		return properties.some(prop => {
			if (prop === 'id') return false;
			return toCompare[prop] !== data[prop];
		});
	}

	async load(params: any = {}) {
		let id = params.id;
		id = id ?? this.#parent.id;

		try {
			if (!id) throw 'ID IS REQUIRED';

			const values = await this.#getRegistry(id);

			this.#parent.loaded = true;
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
		const registry = await this.#records.load(this.#storeName, id);

		if (!registry) {
			this.found = false;
			return;
		}

		this.#parent.set(registry.values);
		this.#registry = registry;

		registry.on('change', this.#listenRegistry);
		return registry;
	};

	/**
	 * Trigger the event to update the component when the registry changes.
	 */
	#listenRegistry = async () => {
		if (!this.#registry) return;
		this.#parent.set(this.#registry.values);
		this.trigger('change');
	};

	async save(data, backend = false) {
		try {
			if (!this.isUnpublished(data)) return;
			data.offline = this.isOnline ? 0 : 1;

			// Add validation for unique fields
			const duplicated = await this.validateUniqueFields(data);
			if (duplicated.length) return { error: 'duplicated', fields: duplicated };

			await this.#registry.update(data, backend);

			return this;
		} catch (e) {
			console.error('error saving', e.message);
		}
	}

	async #update(data) {
		try {
			if (!this.isUnpublished) return;
			await this.#store.update(data.id, data);
			// recordsFactory.update(this.#storeName, data.id, data);
		} catch (e) {}
	}

	async validateUniqueFields(data) {
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
}
