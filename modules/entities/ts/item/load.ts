import type { Item } from '.';
import { LocalProvider } from './local-provider';
export class ItemLoadManager {
	#parent: Item<any>;

	#localProvider: LocalProvider;
	#provider;
	#getProperty;
	constructor(parent, getProperty) {
		this.#parent = parent;
		this.#getProperty = getProperty;

		this.init();
	}

	init = async () => {
		this.#localProvider = this.#getProperty('localProvider');
		this.#provider = this.#getProperty('provider');

		this.#parent.load = this.load;
	};

	/**
	 *
	 * @param id
	 * @returns
	 */
	load = async (params: any) => {
		try {
			await this.#getProperty('checkReady')();
			const localdb = await this.#getProperty('localdb');
			// if (localdb && this.#localProvider) {
			// 	const localData = await this.#localProvider.load(params);

			// 	if (localData?.status) this.#parent.set(localData.data, true);
			// }

			// if (this.#localProvider && !this.#localProvider.isOnline) return { status: true };

			if (!this.#provider) return;

			const remoteData = await this.remoteLoad(params);
			if (!remoteData) this.#parent.found = false;

			if (remoteData) {
				let same = true;
				Object.keys(remoteData).forEach(key => {
					let original = this.#localProvider.registry.values;
					if (original[key] !== remoteData[key]) same = false;
				});
				//if (!same) await this.#localProvider.save(remoteData);
			}

			this.#parent.found = true;
			return { status: true };
		} catch (exc) {
			console.error('ERROR LOAD', exc.message);
			return { status: false, error: exc };
		} finally {
			this.#parent.fetching = false;
		}
	};

	remoteLoad = async params => {
		// TODO: CHANGE TO LOAD
		if (!this.#parent.isOnline) return;
		const response = await this.#provider.data(params);
		if (!response.status) throw 'ERROR_DATA_QUERY';
		return response.data;
	};
}
