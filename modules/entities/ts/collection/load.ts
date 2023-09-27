import type { Collection } from '.';
import type { CollectionLocalProvider } from './local-provider';
import { RegistryFactory } from '../registry/factory';
import type { ResponseAdapter } from '../adapter';
import { IResponseAdapter } from '../adapter/interface';
interface ILoadResponse {
	localLoaded: true;
	fetching: false;
	total: number;
	next?: boolean | number | string;
	items?: any[];
}
export class CollectionLoadManager {
	filter: any;
	#localProvider: CollectionLocalProvider;
	#provider;
	#parentBridge;
	#parent: Collection;
	#registry: RegistryFactory;
	#adapter: IResponseAdapter;
	get parent() {
		return this.#parent;
	}
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
		this.#adapter = this.#parent.responseAdapter;

		this.init();
	}

	init() {
		this.#localProvider = this.#parentBridge.get('localProvider');
		this.#provider = this.#parentBridge.get('provider');

		this.#registry = RegistryFactory.get(this.#parentBridge.get('storeName'));
		if (this.#localProvider) this.#parent.customFilter = this.#localProvider?.customFilter;
	}

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
		if (!this.#localProvider) return;
		//if (this.parent.sOnline || this.#provider) return;
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
		this.#parent.loaded = true;
		this.parent.set(properties);
		return this.#adapter.toClient({ data: items });
	};

	#page = 1;
	#remoteElements = [];

	#localSave = async (params: any = {}) => {};

	load = async (params: any = {}) => {
		try {
			this.parent.fetching = true;
			const { next } = this.parent;
			let { start = 0, update } = params;
			params.limit = params.limit ?? 30;
			start = update === true && next ? next : start;
			if (update) {
				this.#page++;
				params.start = start;
			}

			await this.#localLoad(params);

			const response = await this.#provider.list(params);
			const data = this.#adapter.fromRemote(response);
			const items: any[] = await this.processRemoteEntries(data);

			this.remoteData = response;

			this.#remoteElements = params.update === true ? this.#remoteElements.concat(items) : items;
			this.#remoteElements.forEach(item => console.log(10.8, item.id, item));
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

	async processRemoteEntries(data): Promise<any[]> {
		if (!data.entries && !data.items) {
			throw new Error('The list method must return an object with an entries property');
		}

		const elements = data.items ? data.items : data.entries;
		if (data.deletedEntries) {
			// todo: unify it in recordsFactory
			this.#localProvider.softDelete(data.deletedEntries);
		}

		await this.#localProvider.save(elements);

		const promises = [];
		const items = elements.map(record => {
			const item = new this.parent.item({ id: record.id, properties: record });
			promises.push(item.isReady);
			return item;
		});
		await Promise.all(promises);
		console.log(10.5, items);
		items.forEach((item, index) => {
			console.log(10.6, item.id, item);
			item.set(elements[index], true);
		});
		return items;
	}

	processEntries = (entries): any[] => {
		this.#registry.registerList(this.#parentBridge.get('storeName'), entries);
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
