import type { Item } from './index';

export class ItemSaveManager {
	#parent: Item<any>;
	#getProperty;
	#bridge;
	#provider;
	#localProvider;

	constructor(parent: Item<any>, bridge) {
		this.#parent = parent;
		this.#getProperty = bridge.get;
		this.#bridge = bridge;
		this.init();
	}

	init() {
		this.#parent.save = this.save;
		this.#parent.publish = this.publish;
		this.#localProvider = this.#getProperty('localProvider');
		this.#provider = this.#getProperty('provider');
		this.#parent.sync = this.sync;
	}

	save = async (data = undefined) => {
		try {
			await this.#getProperty('checkReady')();

			if (data) this.#parent.set(data);

			if (!this.#parent.isUnpublished) return {status: true};

			const properties = data || this.#parent.getProperties();

			if (this.#localProvider) await this.#localProvider.save(properties);

			await this.#publish(properties);
			this.#parent.triggerEvent();

			return { status: true };
		} catch (e) {
			console.error('error saving', e);
			return {status: false, error: e}

		}
	};

	#publish = async properties => {
		try {
			if (!this.#provider || !this.#bridge.get('isOnline')) return;
			const response = await this.#provider.publish(properties);

			if (!response?.status) throw response.error;

			if (this.#localProvider) {
				this.#localProvider.save(response.data, true);
				this.#localProvider.triggerEvent();
			}
			return { status: true, data: response };
		} catch (error) {
			console.error('ERROR PUBLISHING', error);
			return { status: false, error };
		}
	};

	publish = this.save;

	sync = () => {
		const provider = this.#getProperty('localProvider');

		if (!provider.registry.values.offline) {
			console.warn('registry already synced');
			return;
		}

		this.#publish(provider.registry.values);
		//const data = this.#getProperty("localProvider").store.where("offline").equals(true).toArray();
	};
}
