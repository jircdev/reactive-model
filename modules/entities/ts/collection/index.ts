import { ReactiveModel, reactiveProps } from '@beyond-js/reactive-2/model';
import type { Item, IITem } from '../item';
import { CollectionLocalProvider } from './local-provider';
import { CollectionSaveManager } from './publish';
import { CollectionLoadManager } from './load';

interface IColleciton {
	items: object[];
	item: Item<IITem>;
	next: number | undefined;
	provider: object;
}

interface ISpecs { }
interface ICollectionProvider {
	load: Function;
	publish: Function;
	delete: Function;
}

export /*bundle */ abstract class Collection extends ReactiveModel<IColleciton> {
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

	provider: any;
	next: number | undefined;

	#localProvider: CollectionLocalProvider;
	get localProvider() {
		return this.#localProvider;
	}

	#saveManager: CollectionSaveManager;
	#loadManager: CollectionLoadManager;
	#provider: ICollectionProvider;
	#initSpecs: ISpecs = {};
	protected sortBy: string = 'id';
	protected sortDirection: 'asc' | 'desc' = 'asc';

	constructor() {
		super();
		this.reactiveProps<IColleciton>(['item', 'next', 'provider']);
	}

	protected setItems(values) {
		this.#items = values;
	}
	protected async init(specs: ISpecs = {}) {
		this.#initSpecs = specs;

		const getProperty = property => this[property];
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

	async store() {
		await this.#localProvider.init();
		return this.#localProvider.store;
	}
}
