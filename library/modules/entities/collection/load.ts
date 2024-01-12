import type { Collection } from '.';
import type { CollectionLocalProvider } from './local-provider';
import { RegistryFactory } from '../registry/factory';
import { IResponseAdapter } from '../adapter/interface';
import { Item } from '../item';
import { IProvider } from '../interfaces/provider';
interface ILoadResponse {
	localLoaded: true;
	fetching: false;
	total: number;
	next?: boolean | number | string;
	items?: (typeof Item)[];
}
export class CollectionLoadManager {
	filter: any;
	#localProvider: CollectionLocalProvider;
	#provider: IProvider;
	#parentBridge: {
		get: (property: string) => any;
		set: (property: string, value: any) => void;
	};
	#parent: Collection;
	#registry: RegistryFactory;
	#adapter: IResponseAdapter;
	get parent() {
		return this.#parent;
	}

	protected remoteData = [];
	constructor(
		parent: Collection,
		parentBridge: {
			get: (property: string) => any;
			set: (property: string, value: any) => void;
		}
	) {
		this.#parent = parent;
		this.#parentBridge = parentBridge;
		this.#adapter = this.#parent.responseAdapter;

		this.init();
	}

	init() {
		this.#localProvider = this.#parentBridge.get('localProvider');
		this.#provider = this.#parentBridge.get('provider');

		this.#registry = RegistryFactory.get(this.#parentBridge.get('storeName'));
		if (this.#localProvider) this.#parent.customFilter = this.#localProvider?.customFilter;
	}

	#localLoad = async params => {
		if (!this.#localProvider) return;
		//if (this.parent.sOnline || this.#provider) return;
		const localData = (await this.#localProvider.load(params)) ?? { data: [] };

		const newItems = await this.processEntries(localData.data);

		let items = params.update === true ? this.parent.items.concat(newItems) : newItems;

		const properties: ILoadResponse = {
			localLoaded: true,
			fetching: false,
			total: localData.total ?? 0,
			next: !!localData.next,
			items,
		};
		if (localData.next) properties.next = localData.next;
		this.#parent.loaded = true;

		this.parent.set(properties);
		return this.#adapter.toClient({ data: items });
	};

	#page = 1;
	#remoteElements = [];
	localLoad = async (params: any = {}) => {
		try {
			return this.#localLoad(params);
		} catch (e) {
			console.error(e);
		}
	};
	load = async (params: any = {}) => {
		try {
			this.#parent.fetching = true;
			const { next } = this.parent;
			let { start = 0, update } = params;
			params.limit = params.limit ?? 30;
			start = update === true && next ? next : start;
			if (update) {
				this.#page++;
				params.start = start;
			}

			const localResponse = await this.#localLoad(params);

			if (!this.#parent.isOnline || !this.#provider) return localResponse;
			const response = await this.#provider.list(params);
			const data = this.#adapter.fromRemote(response);

			const items: (typeof Item)[] = await this.processRemoteEntries(data);

			this.remoteData = response;

			this.#remoteElements = params.update === true ? this.#remoteElements.concat(items) : items;

			const properties = {
				items: this.#remoteElements,
				next: data.next,
				loaded: true,
				fetching: false,
				total: data.total ?? 0,
			};
			this.parent.set(properties);
			this.parent.triggerEvent();
			return this.#adapter.toClient({ data: items });
		} catch (exc) {
			this.parent.triggerEvent();
			console.error(exc);
			return this.#adapter.toClient({ error: exc });
		} finally {
			this.#parent.fetching = false;
			this.#parent.fetched = true;
			this.#parent.landed = true;
		}
	};

	async processRemoteEntries(data: { [key: string]: any }): Promise<any[]> {
		if (!data.entries && !data.items) {
			throw new Error('The list method must return an object with an entries property');
		}

		const elements = data.items ? data.items : data.entries;
		if (data.deletedEntries) {
			// todo: unify it in recordsFactory
			this.#localProvider.softDelete(data.deletedEntries);
		}

		await this.#localProvider.save(elements);
		return this.setItems(elements);
	}

	async setItems(entries: (typeof Item)[]) {
		const promises = [];
		const items = entries.map(record => {
			const item = new this.parent.item({ id: record.id, properties: record });
			promises.push(item.set(record));
			return item;
		});

		await Promise.all(promises);
		items.forEach((item, index) => {
			item.set(entries[index], true);
		});

		return items;
	}

	/**
	 *
	 * @param entries
	 * @param updateLocalItems
	 * @returns
	 */
	processEntries = async (entries: (typeof Item)[], updateLocalItems = false): Promise<Item<any>[]> => {
		//	this.#registry.registerList(this.#parentBridge.get('storeName'), entries);
		const promises = [];
		const items = entries.map(record => {
			const specs: { id: string; properties?: any } = { id: record.id };
			if (updateLocalItems) specs.properties = record;

			const item = new this.parent.item(specs);
			promises.push(item.set(record));
			return item;
		});

		await Promise.all(promises);
		items.forEach((item, index) => {
			item.set(entries[index], updateLocalItems);
		});

		return items;
	};

	remoteLoad = async params => {
		const response = await this.#provider.load(params);
		if (!response.status) throw 'ERROR_DATA_QUERY';
		return response.data;
	};
}
