import type { Item } from '.';

import { IResponseAdapter } from '../adapter/interface';
import { LocalProvider } from './local-provider';
export class ItemLoadManager {
	#parent: Item<any>;

	#localProvider: LocalProvider;
	#provider;
	#getProperty;
	#bridge;
	#adapter: IResponseAdapter;
	ready: boolean;

	constructor(parent, bridge) {
		this.#parent = parent;
		this.#getProperty = bridge.get;
		this.#bridge = bridge;
		this.#adapter = this.#parent.responseAdapter;
		this.init();
	}

	init = () => {
		this.#localProvider = this.#getProperty('localProvider');
		this.#provider = this.#getProperty('provider');
		this.ready = true;
	};

	async loadLocally(params) {
		if (!params) {
			params = { id: this.#parent.id };
		}
		const localdb = await this.#getProperty('localdb');
		const localProvider = this.#getProperty('localProvider');

		if (!params && this.#parent.id) params = { id: this.#parent.id };

		if (localdb && localProvider) {
			const localData = await localProvider.load(params);
			if (localData?.status) this.#parent.set(localData.data, true);
		}
	}
	/**
	 * Load the data from the provider and save it in the local database
	 *
	 * The method returns the data from the provider, if the provider is not set, it returns undefined, if
	 * the provider method returns more data than the properties defined in the object, the data will be
	 * available in the response.data object returned by the method.
	 *
	 * @param id
	 * @returns
	 */
	load = async (params: any) => {
		try {
			await this.#getProperty('checkReady')();
			const localdb = await this.#getProperty('localdb');
			const localProvider = this.#getProperty('localProvider');
			await this.loadLocally(params);
			if (localProvider && !localProvider.isOnline) return { status: true };
			if (!this.#provider) return;

			const remoteData = await this.remoteLoad(params);

			if (!remoteData) {
				this.#parent.found = false;
				return this.#adapter.toClient();
			}

			this.#parent.found = true;
			this.#parent.set(remoteData);
			if (localdb) {
				await this.updateLocally(remoteData);
			}

			return this.#adapter.toClient({ data: remoteData });
		} catch (exc) {
			throw exc;
		} finally {
			this.#parent.fetching = false;
		}
	};

	async updateLocally(data) {
		let same = true;
		this.#parent.landed = true;
		const localProvider = this.#getProperty('localProvider');
		Object.keys(data).forEach(key => {
			let original = localProvider.registry.values;
			if (original[key] !== data[key]) same = false;
		});

		if (!same) await this.#localProvider.save(data);
	}

	remoteLoad = async params => {
		// TODO: CHANGE TO LOAD
		if (!this.#parent.isOnline) return;
		/**
		 * The data method is validated to support old providers.
		 */
		console.log(101, this.#provider, this.#provider.data);
		let loadMethod = this.#provider.data
			? this.#provider.data.bind(this.#provider)
			: this.#provider.load.bind(this.#provider);

		if (typeof loadMethod !== 'function') {
			console.error('The provider object is not defined correctly. It must have a data method');
			return;
		}

		const response = await loadMethod(params);

		return this.#adapter.fromRemote(response);
	};
}