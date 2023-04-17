export class ItemLoadManager {
	#parent;

	constructor(parent) {
		this.#parent = parent;
		this.init();
	}

	init = async () => {
		this.#parent.load = this.load;
	};

	load = async id => {
		try {
			const parent = this.#parent;
			this.#parent.fetching = true;

			if (await this.#parent.localdb) {
				const localData = await this.#parent.localProvider.load(id);
				console.log(0.2, "local", localData);
			}

			if (this.#parent.localProvider && !this.#parent.localProvider.isOnline) return;

			const remoteData = await this.remoteLoad({ id });

			if (!remoteData) {
				this.#parent.found = false;
			}

			if (remoteData) {
				let same = true;
				Object.keys(remoteData).forEach(key => {
					let original = this.#parent.localProvider.originalData;
					if (original[key] !== remoteData[key]) same = false;
				});

				if (!same) await this.#parent.localProvider.save(remoteData);
			}
		} catch (exc) {
			console.log("ERROR LOAD", exc);
		} finally {
			this.#parent.fetching = false;
		}
	};

	remoteLoad = async params => {
		const response = await this.#parent.provider.load(params);

		if (!response.status) throw "ERROR_DATA_QUERY";
		return response.data;
	};
}
