import type { Item } from '.';
export class ItemLoadManager {
	#parent: Item<any>;

	#localProvider;
	#provider;
	#getProperty;
	constructor(parent, getProperty) {
		this.#parent = parent;
		this.#getProperty = getProperty;

		this.init();
	}

	init = async () => {
		this.#parent.load = this.load;

		this.#localProvider = this.#getProperty('localProvider');
		this.#provider = this.#getProperty('provider');
	};

	/**
	 *
	 * @param id
	 * @returns
	 */
	load = async (params: any) => {
		try {
			await this.#getProperty('checkReady')();
			if (await this.#getProperty('localdb')) {
				const localData = await this.#localProvider.load(params);
				if (localData) this.#parent.set(localData);
			}

			if (this.#localProvider && !this.#localProvider.isOnline) return;

			if (!this.#provider) return console.warn('No provider');

			const remoteData = await this.remoteLoad(params);
			if (!remoteData) this.#parent.found = false;

			if (remoteData) {
				let same = true;
				Object.keys(remoteData).forEach((key) => {
					let original = this.#localProvider.registry.values;
					if (original[key] !== remoteData[key]) same = false;
				});

				if (!same) await this.#localProvider.save(remoteData);
			}
			return { status: true };
		} catch (exc) {
			console.error('ERROR LOAD', exc.message);
			return { status: false, error: exc };
		} finally {
			this.#parent.fetching = false;
		}
	};

	remoteLoad = async (params) => {
		// TODO: CHANGE TO LOAD
		const response = await this.#provider.data(params);
		if (!response.status) throw 'ERROR_DATA_QUERY';
		return response.data;
	};
}
