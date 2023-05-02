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
	load = async (id: undefined | string | number) => {
		try {
			await this.#getProperty("checkReady")();

			const parent = this.#parent;
			parent.fetching = true;
			if (!id) id = parent.id;

			if (await this.#getProperty("localdb")) {
				const localData = await this.#localProvider.load(id);
				if (localData) this.#parent.set(localData);
			}

			if (this.#localProvider && !this.#localProvider.isOnline) return;

			if (!this.#provider) return;

			const remoteData = await this.remoteLoad({ id });

			if (!remoteData) {
				this.#parent.found = false;
			}

			if (remoteData) {
				let same = true;
				Object.keys(remoteData).forEach(key => {
					let original = this.#localProvider.registry.values;
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
