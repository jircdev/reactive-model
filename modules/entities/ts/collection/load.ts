import type { Collection } from '.';
import { PendingPromise } from '@beyond-js/kernel/core';
export class CollectionLoadManager {
	#parent: Collection;
	get parent() {
		return this.#parent;
	}

	#localProvider;
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
		this.#parent.load = this.load;
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

	load = async (params: any = {}) => {
		try {
			this.parent.fetching = true;
			let { limit = 30, start = 1, update } = params;

			const { next } = this.parent;
			start = start ?? (update === true && next ? next : 0);

			if (await this.#parentBridge.get('localProvider')) {
				const localData = await this.#localProvider.load(params);
				if (localData) this.#parentBridge.get('setItems')(this.processEntries(localData));
			}

			if (this.#localProvider && !this.#localProvider.isOnline) {
				return;
			}
			if (!this.#provider) return;

			const remoteData = await this.#provider.list(params);
			const { status, data, error } = remoteData;

			if (!status) throw error ?? 'ERROR_LIST_QUERY';

			const items: any[] = this.processEntries(data.entries);

			let itemsValue = params.update === true ? this.parent.items.concat(items) : items;
			const properties = {
				items: itemsValue,
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

	processEntries = (entries): any[] => {
		return entries.map((record) => {
			const item = new this.parent.item();
			item.set(record, true);
			return item;
		});
	};

	remoteLoad = async (params) => {
		const response = await this.#provider.load(params);

		if (!response.status) throw 'ERROR_DATA_QUERY';
		return response.data;
	};
}
