import type { Item } from './index';

export class ItemSaveManager {
	#parent: Item<any>;
	#getProperty;
	constructor(parent, getProperty) {
		this.#parent = parent;
		this.#getProperty = getProperty;
		this.init();
	}

	init() {
		this.#parent.save = this.save;
		this.#parent.publish = this.publish;
		this.#parent.sync = this.sync;
	}

	save = async (data = undefined) => {
		try {
			await this.#getProperty('checkReady')();

			if (data) {
				this.#parent.set(data);
			}

			if (!this.#parent.isUnpublished) {
				return;
			}

			const properties = this.#parent.getProperties();

			if (this.#parent.localProvider) {
				await this.#parent.localProvider.save(properties);
			}

			await this.#publish(properties);
			this.#parent.triggerEvent();

			return { status: true };
		} catch (e) {
			console.error('error saving', e);
		}
	};

	#publish = async properties => {
		try {
			if (!this.#parent.provider || !this.#parent.isOnline) return;

			const response = await this.#parent.provider.publish(properties);

			if (!response?.status) throw response.error;

			if (this.#parent.localProvider) {
				this.#parent.localProvider.save(response.data, true);
				this.#parent.localProvider.triggerEvent();
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
