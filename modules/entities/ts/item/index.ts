import { ReactiveModel, reactiveProps } from '@beyond-js/reactive/model';

import { LocalProvider } from './local-provider';
import { ItemSaveManager } from './save';
import { ItemLoadManager } from './load';
import { PendingPromise } from '@beyond-js/kernel/core';
import { IITem } from './interfaces/item';
import { IItemConfig } from './interfaces/config';

export /*bundle*/ abstract class Item<IITem> extends ReactiveModel<IITem> {
	#info = new Map();
	/**
	 * Represent the data that is stored in the local database
	 */
	#localData = new Map();
	declare localUpdate: (data) => Promise<Item>;
	protected localdb = true;
	#provider: any;
	get provider() {
		return this.#provider;
	}
	protected storeName: string;
	protected db: string;
	#ignoredFields: Array<string> = [];
	#skeleton: Array<string> = [];
	protected localProvider: LocalProvider;

	protected unique: Array<string> = [];

	get isUnpublished() {
		return this.localProvider.isUnpublished(this.getProperties());
	}
	#saveManager: ItemSaveManager;

	get skeleton() {
		return this.#skeleton;
	}

	private __get(property) {
		return this[property];
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

	get instanceId() {
		return this.localProvider.instanceId;
	}

	get landed() {
		return this.localProvider?.landed;
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
	constructor(config: IItemConfig = {}) {
		super();

		const { db, storeName } = config;

		if (db) this.db = db;
		if (storeName) this.storeName = storeName;
		if (config.provider) {
			if (typeof config.provider !== 'function') {
				throw new Error('Provider must be an object');
			}
			this.#provider = new config.provider();
		}

		this.on('object.loaded', this.checkReady);
		this.reactiveProps(['found']);
		const getProperty = property => this.__get(property);
		const setProperty = (property, value) => (this[property] = value);
		const bridge = { get: getProperty, set: setProperty };
		this.localProvider = new LocalProvider(this, bridge);
		this.#saveManager = new ItemSaveManager(this, bridge);
		this.#loadManager = new ItemLoadManager(this, bridge);

		if (this.db && this.storeName) this.init(config);
	}

	protected async init(config: { id?: string | number } = {}) {
		try {
			let id;
			if (this.#initPromise) return this.#initPromise;

			this.#initPromise = new PendingPromise();
			if (config.id) id = config.id;

			await this.localProvider.init(id);
			if (this.#skeleton && this.#skeleton.length > 0) {
				this.properties = this.#skeleton;
			}
			this.ready = true;
			this.#initPromise.resolve(true);
			this.trigger('object.loaded');
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
	 */
	set(data, init = false) {
		//	If init is true, store the data in localData Map
		if (init) {
			this.#localData = new Map(Object.entries(data));
			this.localProvider.save(data, true);
		}
		if (this.storeName === 'Classes') console.log(77, data);
		// If a property is in the properties array, define it as a public property

		this.properties.forEach(property => {
			if (data.hasOwnProperty(property)) {
				this[property] = data[property];
			}
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

	async delete() {
		try {
			this.#isDeleted = 1;

			if (this.localProvider) await this.localProvider.delete();
			if (this.provider) await this.provider.delete(this.id);
			this.triggerEvent();

			return true;
		} catch (e) {
			console.error('error', e);
		}
	}
}
