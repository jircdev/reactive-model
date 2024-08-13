import { ReactiveModel } from '@beyond-js/reactive/model';
import { CollectionLocalProvider } from './local-provider';
import { CollectionSaveManager } from './publish';
import { CollectionLoadManager } from './load';
import { IProvider } from '../interfaces/provider';
import { ICollectionSpecs, ICollection } from './interfaces/collection';
import { ResponseAdapter } from '../adapter';
import { IResponseAdapter } from '../adapter/interface';
import { Item } from '../item';

export /*bundle */ class Collection extends ReactiveModel<Collection> {
	declare triggerEvent: (event?: string) => void;
	declare storeName: string;
	declare trigger: (event?: string) => void;
	declare reactiveProps: <T>(props: Array<keyof T>) => void;
	landed: boolean = false;
	db: string;
	item: typeof Item;

	protected localdb: boolean = true;

	#elements = new Map();
	get elements() {
		return this.#elements;
	}

	get items() {
		if (this.orderBy) {
			return [...this.#elements.values()].sort((a, b) => {
				if (a[this.orderBy] > b[this.orderBy]) {
					return -1;
				}
				if (a[this.orderBy] < b[this.orderBy]) {
					return 1;
				}
				return 0;
			});
		}

		return [...this.#elements.values()];
	}

	get isOnline() {
		return !this.localProvider ? true : this.localProvider.isOnline;
	}
	set items(value: Array<any | undefined>) {
		if (!Array.isArray(value)) {
			return;
		}
		this.#elements.clear();
		value.forEach(item => this.#elements.set(item.id, item));
		this.triggerEvent();
	}

	counters: any = {};
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
	protected orderBy: string = 'timeCreated';
	protected sortDirection: 'asc' | 'desc' = 'asc';

	#responseAdapter: IResponseAdapter;
	get responseAdapter() {
		return this.#responseAdapter;
	}
	#initialSpecs: ICollectionSpecs;
	constructor(specs: ICollectionSpecs) {
		super({ properties: ['total', 'next'] });

		const { provider, storeName, db, localdb, item } = specs;
		this.#initialSpecs = specs;
		if (storeName) this.storeName = storeName;
		if (db) this.db = db;
		this.localdb = localdb !== undefined ? localdb : true;
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
		const bridge = { get: getProperty, set: setProperty, clear: this.#clear.bind(this) };
		this.#responseAdapter = ResponseAdapter.get(this, this.#initialSpecs?.adapter);
		this.#localProvider = new CollectionLocalProvider(this, bridge);
		this.#saveManager = new CollectionSaveManager(this, bridge);
		this.#loadManager = new CollectionLoadManager({ parent: this, bridge, localdb: this.localdb });
		this.#localProvider.on('items.changed', this.#listenItems);
		this.localProvider.init();
	}

	#listenItems = async () => {
		if (!this.localdb) return;

		this.items = await this.#loadManager.processEntries(this.#localProvider.items);

		this.trigger('change');
	};

	setOffline = value => this.localProvider.setOffline(value);

	protected setItems(values) {
		this.items = values;
	}

	async store() {
		await this.#localProvider.init();
		return this.#localProvider.store;
	}

	async set(data) {
		const { items } = data;
		delete data.item;
		await super.set(data);

		items.forEach(item => {
			if (item.id) this.#elements.set(item.id, item);
		});
	}

	#clear() {
		this.items = [];
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
	localLoad(args) {
		return this.#loadManager.localLoad(args);
	}
	filter = (args?) => this.#loadManager.filter(args);
	save = (args?, init?) => this.#saveManager.save(args, init);

	publish = (args?) => this.#saveManager.publish(args);

	async setEntries(entries) {
		await this.save(entries, true);
		const items = await this.#loadManager.processEntries(entries, true);

		items.forEach(item => this.#elements.set(item.id, item));
		this.items = items;
		this.trigger('change');
		return items;
	}
}
