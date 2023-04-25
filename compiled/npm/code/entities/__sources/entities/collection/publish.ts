export class CollectionSaveManager {
	#parent;
	#bridge;
	#localProvider;
	#provider;
	constructor(parent, bridge) {
		this.#parent = parent;
		this.#bridge = bridge;
		this.init();
	}

	init() {
		this.#parent.save = this.save;
		this.#parent.sync = this.sync;
		this.#parent.publish = this.publish;
		this.#localProvider = this.#bridge.get("localProvider");
		this.#provider = this.#bridge.get("provider");
	}

	save = async (data = []): Promise<any> => {
		await this.#localProvider.save(data);
	};

	publish = async (data = []): Promise<any> => {
		try {
			await this.save(data);

			const response = await this.#provider.bulkSave(data);
			if (!response.status) {
				console.log("error...", response);
			}
		} catch (e) {
			console.log(e);
		}
	};

	sync = () => {
		const data = this.#parent.localProvider.store.where("offline").equals(true).toArray();
		console.log(1300, data);
	};
}
