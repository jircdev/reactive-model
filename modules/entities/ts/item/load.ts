import type { Item } from ".";
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
		this.#localProvider = this.#getProperty("localProvider");
		this.#provider = this.#getProperty("provider");
	};

	/**
	 *
	 * @param id
	 * @returns
	 */
	load = async id => {
		try {
			const parent = this.#parent;
			this.#parent.fetching = true;

			if (await this.#parent.get("localdb")) {
				const localData = await this.#localProvider.load(id);
			}

			if (this.#localProvider && !this.#localProvider.isOnline) return;

			const remoteData = await this.remoteLoad({ id });

			if (!remoteData) {
				this.#parent.found = false;
			}

			if (remoteData) {
				let same = true;
				Object.keys(remoteData).forEach(key => {
					let original = this.#localProvider.originalData;
					if (original[key] !== remoteData[key]) same = false;
				});

				if (!same) await this.#localProvider.save(remoteData);
			}
		} catch (exc) {
			console.log("ERROR LOAD", exc);
		} finally {
			this.#parent.fetching = false;
		}
	};

	remoteLoad = async params => {
		const response = await this.#provider.load(params);

		if (!response.status) throw "ERROR_DATA_QUERY";
		return response.data;
	};
}
