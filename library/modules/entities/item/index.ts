import { ReactiveModel } from '@beyond-js/reactive/model';
import { LocalProvider } from './local-provider';
import { ItemSaveManager } from './save';
import { ItemLoadManager } from './load';
import { PendingPromise } from '@beyond-js/kernel/core';
import { IItem } from './interfaces/item';
import { IItemConfig } from './interfaces/config';
import { ResponseAdapter } from '../adapter';
import { IResponseAdapter } from '../adapter/interface';
import { ListenerFunction } from '@beyond-js/events/events';

export /*bundle*/ class Item<T> extends ReactiveModel<IItem> {
	declare trigger: (event?: string) => void;
	declare triggerEvent: (event?: string) => void;
	declare getProperties: () => any;
	declare on: (event: string, listener: ListenerFunction, priority?: number) => this;

	id: string | number;

	declare localUpdate: (data) => Promise<any>;
	protected localdb: boolean;
	#provider: any;
	protected storeName: string;
	protected db: string;
	localFields = [];
	#localData;
	/**
	 * @todo: Check if this is used and the purpose of it
	 */
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
		if (typeof this.checkReady !== 'function') {
			console.warn('is not a function', this.checkReady, this.constructor.name);
			return;
		}

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
		super((()=>config?.properties ? { properties: config.properties } : {})());

		const { db, storeName, localdb } = config;
		this.#config = config;
		this.#responseAdapter = ResponseAdapter.get(this, this.#config?.adapter);

		if (db) this.db = db;
		if (storeName) this.storeName = storeName;
		this.localdb = localdb || !!(db && storeName);
		if (config.provider) {
			if (typeof config.provider !== 'function') {
				throw new Error('Provider must be an function');
			}
			this.#provider = new config.provider(this);
		}
		this.#start(config);
		this.on('object.loaded', this.checkReady);
	}

	#start(config) {
		this.reactiveProps(['found', 'landed']);
		this.save = this.save.bind(this);
		this.checkReady = this.checkReady.bind(this);
		const getProperty = property => this.__get(property);
		const setProperty = (property, value) => (this[property] = value);
		const bridge = { get: getProperty, set: setProperty };
		const spcs = { parent: this, bridge, localdb: this.localdb };
		this.localProvider = new LocalProvider(spcs);
		this.#saveManager = new ItemSaveManager(spcs);
		this.#loadManager = new ItemLoadManager(spcs);
		this.init(config);
	}

	protected async initialise() {
		this.init(this.#config);
	}

	/**
	 * Validates if the object is ready to be used
	 *
	 * Is implemented internally by methods such as publish or load to avoid errors in cases
	 * where could it be called before the object is ready.
	 *
	 * @returns {Promise<boolean>} A promise that resolves when the object is ready
	 */
	protected checkReady() {
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
	}

	protected async init(config: IItemConfig) {
		try {
			let id;

			if (this.#initPromise) return this.#initPromise;

			this.#initPromise = new PendingPromise();

			if (config.id) id = config.id;
			this.id = config.id;
			if (this.localdb) {
				await this.localProvider.init(id);
				this.set(this.localProvider.registry.values);
			}

			if (this.#skeleton && this.#skeleton.length > 0) {
				this.properties = this.#skeleton;
			}

			if (config.properties) this.set(config.properties, true);

			this.ready = true;
			this.#initPromise.resolve(true);
			this.trigger('object.loaded');
		} catch (e) {
			console.error('error initializing', e);
		}
	}

	setOffline = value => this.localProvider.setOffline(value);

	/**
	 * Set the data of the object
	 *
	 * @param data The data to set
	 * @param init If true, the data will be stored in the local database
	 */
	async set(data, init = false) {
		if (!init) {
			/**
			 * init is passed as true when it is called by the init method or collections objects,
			 * the isReady promise needs to be validated when the method is called by the user
			 */
			await this.isReady;
		}

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
			this.triggerEvent();

			return true;
		} catch (e) {
			console.error('error', e);
		}
	}
}
