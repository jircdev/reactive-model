import type { Collection } from '.';
import { PendingPromise } from '@beyond-js/kernel/core';
import type { CollectionLocalProvider } from './local-provider';
interface ILoadResponse {
	localLoaded: true;
	fetching: false;
	total: number;
	next?: boolean | number | string;
}
export class CollectionLoadManager {
	#parent: Collection;
	get parent() {
		return this.#parent;
	}

	#localProvider: CollectionLocalProvider;
	#provider;
	#getProperty;
	#parentBridge;
	#localdb;

	constructor(parent, parentBridge) {
		this.#parent = parent;
		this.#parentBridge = parentBridge;
		this.init();
	}

	init = async () => {
		this.#localdb = this.#parentBridge.get('localdb');
		this.#localProvider = this.#parentBridge.get('localProvider');
		this.#provider = this.#parentBridge.get('provider');
		this.#parent.load = this.load;
	};

	/**
	 * metodo general para las consultas de tipo lista para las colecciones
	 * @param params Object filters and configuration
	 * parameters:
	 *  - next
	 *  - limit
	 *  - update // siguiente pagina de misma consulta
	 *
	 *
	 * - status // 1, 0, -1
	 *  {user: [10,30]}
	 *
	 * {and: [{user:10}, {user:30}]]}
	 *
	 *  {user: 10}
	 *  {user: [10,30,40,50]}
	 * {or: [{user:10}, {user:30}]]}
	 * {and: [{user:10}, {user:30}]]}
	 *  el provider debe devolver:
	 *    - next
	 *    - entries
	 *  - total
	 * load({status:1})
	 */

	#localData = [];
	#page = 1;
	#remoteElements = [];
	load = async (params: any = {}) => {
		try {
			this.parent.fetching = true;
			let { start = 0, update } = params;

			params.limit = params.limit ?? 30;
			const { next } = this.parent;
			if (update) this.#page++;
			start = update === true && next ? next : start;
			if (update) {
				params.start = start;
			}

			if (await this.#parentBridge.get('localProvider')) {
				const localData = (await this.#localProvider.load(params)) ?? { data: [] };

				const newItems = this.processEntries(localData.data);

				let items = params.update === true ? this.parent.items.concat(newItems) : newItems;

				// this.#parentBridge.set('items', items);
				if (!this.#localProvider.isOnline || !this.#provider) {
					this.parent.set({ localLoaded: true, fetching: false, total: localData.total });
					return { status: true, data: items };
				}

				const properties: ILoadResponse = {
					localLoaded: true,
					fetching: false,
					total: localData.total ?? 0,
					next: !!localData.next,
				};
				if (localData.next) properties.next = localData.next;

				this.parent.set(properties);
			}

			const remoteData = await this.#provider.list(params);
			const { status, data, error } = remoteData;
			if (!status) throw error ?? 'ERROR_LIST_QUERY';

			const items: any[] = this.processEntries(data.entries);
			if (this.#localProvider) this.#localProvider.save(data.entries);

			// let itemsValue = params.update === true ? this.#remoteElements.concat(items) : items;
			this.#remoteElements = this.#remoteElements.concat(items);

			const properties = {
				items: this.#remoteElements,
				next: data.next,
				loaded: true,
				fetching: false,
				total: data.total ?? 0,
			};

			this.parent.set(properties);
			this.parent.triggerEvent();

			return { status: true, data: items };
		} catch (exc) {
			console.error('ERROR LOAD', exc);
			this.#parent.set({ loaded: false, fetchig: true });
			this.parent.triggerEvent();
			return { status: false, error: { message: exc } };
		}
	};

	processRemoteEntries(entries): any[] {
		return entries.map(record => {
			const item = new this.parent.item();
			item.set(record, true);
			return item;
		});
	}

	processEntries = (entries): any[] => {
		return entries.map(record => {
			const item = new this.parent.item();
			item.set(record);
			return item;
		});
	};

	remoteLoad = async params => {
		const response = await this.#provider.load(params);

		if (!response.status) throw 'ERROR_DATA_QUERY';
		return response.data;
	};
}
