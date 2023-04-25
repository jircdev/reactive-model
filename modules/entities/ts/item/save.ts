export class ItemSaveManager {
	#parent;
	#getProperty;
	constructor(parent, getProperty) {
		this.#parent = parent;
		this.#getProperty = getProperty;
		this.init();
	}

	init() {
		this.#parent.save = this.save;
		this.#parent.sync = this.sync;
	}

	save = async (data = undefined) => {
		try {
			if (data) {
				this.#parent.set(data);
			}

			if (!this.#parent.isUnpublished) {
				return;
			}

			const properties = this.#parent.getProperties();

			const promises = [];
			if (this.#parent.localProvider) {
				await this.#parent.localProvider.save(properties);
			}

			if (this.#parent.provider && this.#parent.provider.isOnline) {
				const response = await this.#parent.provider.save(properties);

				if (this.#parent.localProvider) {
					// this.#parenst.set()
					this.#parent.localProvider.triggerEvent();
				}
			}

			await Promise.all(promises);
		} catch (e) {
			console.error("error saving", e);
		}
	};

	sync = () => {
		const data = this.#getProperty("localProvider").store.where("offline").equals(true).toArray();
	};
}
