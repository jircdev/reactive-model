import type { Item } from './index';
import type { LocalProvider } from './local-provider';

export class ItemSaveManager {
	#parent: Item<any>;
	#getProperty;
	#bridge;
	#provider;
	#localProvider: LocalProvider;

	constructor(parent: Item<any>, bridge) {
		this.#parent = parent;
		this.#getProperty = bridge.get;
		this.#bridge = bridge;
		this.init();
	}

	init() {
		this.#parent.localUpdate = this.localUpdate;
		this.#localProvider = this.#getProperty('localProvider');
		this.#provider = this.#getProperty('provider');
	}

	save = async (data?) => {
		try {
			await this.#getProperty('checkReady')();

			if (data) {
				this.#parent.set(data);
			}

			if (!this.#parent.isUnpublished) {
				return;
			}

			const properties = this.#parent.getProperties();

			if (this.#localProvider) {
				await this.#localProvider.save(properties);
			}

			const response = await this.#publish(properties);
			if (!response?.status) throw response
			this.#parent.triggerEvent();

			return { status: true };
		} catch (e) {
			console.error('error saving', e);
			return e
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

	localUpdate = async (data = undefined) => {
		try {
			await this.#getProperty('checkReady')();

			if (data) {
				this.#parent.set(data);
			}

			const properties = this.#parent.getProperties();

			if (this.#localProvider) {
				// Update the local data without setting it as 'unpublished'
				// (thus, it won't be queued for syncing)
				await this.#localProvider.save(properties, false);
			}

			this.#parent.triggerEvent();

			return { status: true };
		} catch (e) {
			console.error('error updating locally', e);
		}
	};
}
