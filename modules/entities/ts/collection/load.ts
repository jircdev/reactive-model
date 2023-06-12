import type { Collection } from '.';
import type { CollectionLocalProvider } from './local-provider';
interface ILoadResponse {
	localLoaded: true;
	fetching: false;
	total: number;
	next?: boolean | number | string;
	items?: any[];
}
export class CollectionLoadManager {
	#parent: Collection;
	filter: any;
	get parent() {
		return this.#parent;
	}

	#localProvider: CollectionLocalProvider;
	#provider;
	#getProperty;
	#parentBridge;
	#localdb;

	/**
	 * Original data obtained in provider.load
	 *
	 * This property lets the developer access to the original data obtained from the provider in the children object.
	 * Only contains the data from the last load.
	 *
	 */
	protected remoteData = [];
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
		this.#parent.filter = this.filter;
		if (this.#localProvider) this.#parent.customFilter = this.#localProvider?.customFilter;
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

	#localLoad = async params => {
		const localData = (await this.#localProvider.load(params)) ?? { data: [] };

		const newItems = this.processEntries(localData.data);
		let items = params.update === true ? this.parent.items.concat(newItems) : newItems;

		const properties: ILoadResponse = {
			localLoaded: true,
			fetching: false,
			total: localData.total ?? 0,
			next: !!localData.next,
			items,
		};
		if (localData.next) properties.next = localData.next;

		this.parent.set(properties);
		return items;
	};

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

			const { isOnline } = this.parent;

			if (this.#localProvider) {
				const localItems = await this.#localLoad(params);
				console.log('ITEMS => ', localItems)
				if (!isOnline || !this.#provider) {
					return { status: true, data: localItems };
				}
			}

			const remoteData = await this.#provider.list(params);
			this.remoteData = remoteData;
			const { status, data, error } = remoteData;
			if (!status) throw error ?? 'ERROR_LIST_QUERY';

			const items: any[] = await this.processRemoteEntries(data.entries);
			// if (this.#localProvider) await this.#localProvider.save(items);

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
			return { status: true, data: items };
		} catch (exc) {
			console.error('ERROR LOAD', exc);
			this.#parent.set({ loaded: false, fetching: true });
			this.parent.triggerEvent();
			return { status: false, error: { message: exc } };
		}
	};

	async processRemoteEntries(entries): Promise<any[]> {
		await this.#localProvider.save(entries);
		return entries.map(record => {
			const item = new this.parent.item({ id: record.id });

			item.set(record);
			return item;
		});
	}

	processEntries = (entries): any[] => {
		return entries.map(record => {
			const item = new this.parent.item({ id: record.id });
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
