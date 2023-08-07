import { ReactiveModel, reactiveProps } from '@beyond-js/reactive/model';
import type { Item } from '../item';
import { CollectionLocalProvider } from './local-provider';
import { CollectionSaveManager } from './publish';
import { CollectionLoadManager } from './load';
import { IProvider, IProviderConstructor } from '../interfaces/provider';

type ItemConstructor<T extends object = any> = new (args?: { id?: any }) => Item<T>;

interface ICollection {
	items: object[];
	item: ItemConstructor;
	next: number | undefined;
	provider: ItemConstructor;
}

interface ISpecs {
	provider: IProviderConstructor;
	storeName: string;
	db: string;
	localdb?: boolean;
	item: ItemConstructor<any>;
}

export /*bundle */ class Collection extends ReactiveModel<Collection> {
	#items: Array<any | undefined> = [];
	protected localdb = true;
	get items() {
		return this.#items;
	}

	get isOnline() {
		return !this.localProvider ? true : this.localProvider.isOnline;
	}
	set items(value: Array<string | undefined>) {
		if (!Array.isArray(value)) {
			return;
		}

		this.#items = value;
		this.triggerEvent();
	}

	counters: any = {};
	/**
	 * Represents the number of elements in the collection
	 */
	total: number = 0;

	next: number | undefined;

	#localProvider: CollectionLocalProvider;
	get localProvider() {
		return this.#localProvider;
	}

	#saveManager: CollectionSaveManager;
	#loadManager: CollectionLoadManager;
	#provider: IProvider;
	get provider() {
		return this.#provider;
	}

	protected sortBy: string = 'id';
	protected sortDirection: 'asc' | 'desc' = 'asc';

	constructor(specs: ISpecs) {
		super();

		const { provider, storeName, db, localdb, item } = specs;

		if (storeName) this.storeName = storeName;
		if (db) this.db = db;
		if (localdb) this.localdb = localdb;
		if (item) this.item = item;
		if (provider) {
			if (typeof provider !== 'function') {
				throw new Error('Provider must be a class object');
			}
			this.#provider = new provider();
		}

		this.reactiveProps<ICollection>(['next']);
		this.init();
	}

	protected init() {
		const getProperty = property => {
			return this[property];
		};
		const setProperty = (property, value) => (this[property] = value);

		const bridge = { get: getProperty, set: setProperty };

		if (this.localdb) {
			this.#localProvider = new CollectionLocalProvider(this, bridge);

			this.#localProvider.on('items.changed', this.#listenItems);
			this.localProvider.init();
		}

		this.#saveManager = new CollectionSaveManager(this, bridge);
		this.#loadManager = new CollectionLoadManager(this, bridge);
	}

	#listenItems = () => {
		if (!this.localdb) return;

		this.#items = this.#loadManager.processEntries(this.#localProvider.items);
		this.trigger('change');
	};

	setOffline = value => this.localProvider.setOffline(value);

	protected setItems(values) {
		this.#items = values;
	}

	async store() {
		await this.#localProvider.init();
		return this.#localProvider.store;
	}

	async delete(ids) {
		try {
			if (this.#localProvider) await this.#localProvider.softDelete(ids);
			if (this.provider) {
				await this.provider.deleteItems(ids);
			}
		} catch (e) {
			console.error(e);
		}
	}

	load(args?) {
		return this.#loadManager.load(args);
	}
	filter = (args?) => this.#loadManager.filter(args);
	save = (args?) => this.#saveManager.save(args);
	sync = (args?) => this.#saveManager.sync(args);
	publish = (args?) => this.#saveManager.publish(args);
	toSync = () => this.#saveManager.toSync();
}
