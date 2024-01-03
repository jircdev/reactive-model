import { ReactiveModel, reactiveProps } from '@beyond-js/reactive/model';

import { LocalProvider } from './local-provider';
import { ItemSaveManager } from './save';
import { ItemLoadManager } from './load';
import { PendingPromise } from '@beyond-js/kernel/core';
import { IItem } from './interfaces/item';
import { IItemConfig } from './interfaces/config';
import { ResponseAdapter } from '../adapter';
import { IResponseAdapter } from '../adapter/interface';
export /*bundle*/ class Item<Item> extends ReactiveModel<IItem> {
	#info = new Map();
	/**
	 * Represent the data that is stored in the local database
	 */
	#localData = new Map();
	declare localUpdate: (data) => Promise<any>;
	protected localdb = true;
	#provider: any;
	protected storeName: string;
	protected db: string;
	localFields = [];
	#ignoredFields: Array<string> = [];
	#skeleton: Array<string> = [];
	localProvider: LocalProvider;

	protected unique: Array<string> = [];

	#saveManager: ItemSaveManager;

	get skeleton() {
		return this.#skeleton;
	}

	private __get(property) {
		return this[property];
	}

	get provider() {
		return this.#provider;
	}

	#isDeleted = 0;
	get isDeleted() {
		return !!this.#isDeleted;
	}

	get store() {
		return this.localProvider.store;
	}

	get isOnline() {
		return this.localProvider.isOnline && !localStorage.getItem('reactive.offline');
	}

	get __instanceId() {
		return this.localProvider.__instanceId;
	}

	get isReady() {
		return this.checkReady();
	}

	#loadManager: ItemLoadManager;
	#objectReady = false;
	#promiseReady: PendingPromise<boolean>;
	#initPromise: PendingPromise<boolean>;

	/**
	 * Defines if the item was found in the local database
	 */
	declare found: boolean;
	#config: IItemConfig;
	#responseAdapter: IResponseAdapter;
	get responseAdapter() {
		return this.#responseAdapter;
	}
	constructor(config: IItemConfig = {}) {
		super();

		const { db, storeName, localdb = true } = config;
		this.#config = config;
		this.localdb = localdb;
		this.#responseAdapter = ResponseAdapter.get(this, this.#config?.adapter);

		if (db) this.db = db;
		if (storeName) this.storeName = storeName;
		if (config.provider) {
			if (typeof config.provider !== 'function') {
				throw new Error('Provider must be an function');
			}

			this.#provider = new config.provider(this);
		}

		this.on('object.loaded', this.checkReady);
		this.reactiveProps(['found', 'landed']);
		const getProperty = property => this.__get(property);
		const setProperty = (property, value) => (this[property] = value);
		const bridge = { get: getProperty, set: setProperty };
		this.localProvider = new LocalProvider(this, bridge);
		this.#saveManager = new ItemSaveManager(this, bridge);
		this.#loadManager = new ItemLoadManager(this, bridge);
		this.save = this.save.bind(this);
		if (this.db && this.storeName) this.init(config);
	}

	protected async initialise() {
		this.init(this.#config);
	}

	protected async init(config: IItemConfig) {
		try {
			let id;

			if (this.#initPromise) return this.#initPromise;

			this.#initPromise = new PendingPromise();

			if (config.id) id = config.id;

			await this.localProvider.init(id);

			if (this.#skeleton && this.#skeleton.length > 0) {
				this.properties = this.#skeleton;
			}

			if (config.properties) this.set(config.properties, true);

			this.ready = true;
			this.#initPromise.resolve(true);
			this.trigger('object.loaded');
			this.set(this.localProvider.registry.values);
		} catch (e) {
			console.error('error initializing', e);
		}
	}

	/**
	 * Validates if the object is ready to be used
	 *
	 * Is implemented internally by methods such as publish or load to avoid errors in cases
	 * where could it be called before the object is ready.
	 *
	 * @returns {Promise<boolean>} A promise that resolves when the object is ready
	 */
	protected checkReady = () => {
		if (this.ready) {
			return this.ready;
		}
		if (this.#promiseReady) return this.#promiseReady;

		this.#promiseReady = new PendingPromise();

		if (this.objectReady) this.#promiseReady.resolve(this.#objectReady);

		const onReady = () => {
			this.#objectReady = true;
			this.#promiseReady.resolve(this.#objectReady);
		};
		this.on('object.loaded', onReady);
		return this.#promiseReady;
	};

	setOffline = value => this.localProvider.setOffline(value);

	/**
	 * Set the data of the object
	 *
	 * @param data The data to set
	 * @param init If true, the data will be stored in the local database
	 */ x;
	async set(data, init = false) {
		await this.isReady;

		if (init && this.localdb) {
			this.#localData = new Map(Object.entries(data));
			this.localProvider.save(data);
		}

		// If a property is in the properties array, define it as a public property
		type IProperty = {
			name: string;
		};

		this.properties.forEach((property: string | IProperty) => {
			if (typeof property === 'object') {
				if (data.hasOwnProperty(property.name)) {
				}
				return;
			}
			if (data.hasOwnProperty(property)) this[property] = data[property];
		});

		this.triggerEvent();
	}

	/**
	 * @deprecated Please use getProperties instead
	 * @see ReactiveModel.properties
	 */
	getValues() {
		const values = {};
		const toIterate = this.skeleton.length ? this.skeleton : this.properties;

		toIterate.forEach(field => {
			if (this.hasOwnProperty(field)) values[field] = this[field];
		});
		return values;
	}

	getPropertyNames() {
		return this.properties;
	}

	save(data?) {
		return this.#saveManager.save(data);
	}

	sync() {
		return this.#saveManager.sync();
	}

	forceSync() {
		return this.#saveManager.forceSync();
	}

	publish(data?) {
		return this.#saveManager.publish(data);
	}
	load(params?) {
		return this.#loadManager.load(params);
	}
	async delete() {
		try {
			this.#isDeleted = 1;
			if (this.localProvider) await this.localProvider.delete();
			if (this.provider) await this.provider.delete(this.id);
			console.log(500);
			this.triggerEvent();

			return true;
		} catch (e) {
			console.error('error', e);
		}
	}
}
