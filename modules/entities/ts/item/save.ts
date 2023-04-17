export class ItemSaveManager {
	#parent;
	constructor(parent) {
		this.#parent = parent;
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
				console.log("all saved");
				return;
			}

			const properties = this.#parent.getProperties();

			const promises = [];
			if (this.#parent.localProvider) {
				promises.push(this.#parent.localProvider.save(properties));
			}

			if (this.#parent.provider && this.#parent.provider.isOnline) {
				promises.push(this.#parent.provider.save(properties));
			}

			return Promise.all(promises);
		} catch (e) {
			console.error("error saving", e);
		}
	};

	sync = () => {
		const data = this.#parent.localProvider.store.where("offline").equals(true).toArray();
		console.log(1300, data);
	};
}
