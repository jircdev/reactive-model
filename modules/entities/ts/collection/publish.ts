export class CollectionSaveManager {
	#parent;
	#bridge;
	#localProvider;
	#provider;
	#localdb;

	constructor(parent, bridge) {
		this.#parent = parent;
		this.#bridge = bridge;
		this.init();
	}

	init() {
		this.#parent.save = this.save;
		this.#parent.sync = this.sync;
		this.#parent.publish = this.publish;
		this.#localdb = this.#bridge.get('localdb');
		if (this.#localdb) {
			this.#localProvider = this.#bridge.get('localProvider');
		} else {
			console.warn('la colleccion no usa indexeddb');
		}

		this.#provider = this.#bridge.get('provider');
	}

	save = async (data = []): Promise<any> => {
		if (!this.#localdb) return true;
		await this.#localProvider.save(data);
	};

	publish = async (data = []): Promise<any> => {
		try {
			await this.save(data);
			if (!this.#provider || this.#bridge.get('isOffline')) return;

			const response = await this.#provider.bulkSave(data);
			if (!response.status) {
				console.error('error...', response);
			}
		} catch (e) {
			console.error(e.message);
		}
	};

	sync = async () => {
		const data = this.#parent.localProvider.store.where('offline').equals('true').toArray();
		if (!data.length) return;
		const response = await this.#provider.bulkSave(data);
		if (!response.status) {
			console.error('error...', response);
		}

		return data;
	};
}
