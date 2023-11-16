import type { ResponseAdapter } from '../adapter';
import { IResponseAdapter } from '../adapter/interface';
import type { Item } from './index';
import type { LocalProvider } from './local-provider';

export class ItemSaveManager {
	#parent: Item<any>;
	#getProperty;
	#bridge;
	#provider;
	#localProvider: LocalProvider;

	#adapter: IResponseAdapter;
	constructor(parent: Item<any>, bridge) {
		this.#parent = parent;
		this.#getProperty = bridge.get;
		this.#bridge = bridge;
		this.#adapter = this.#parent.responseAdapter;
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

			console.log(1);

			if (data) {
				await this.#parent.set(data);
			}

			console.log(2);

			if (!this.#parent.isUnpublished) return;

			const properties = { ...data, ...this.#parent.getProperties() };

			console.log(4);

			properties.isNew = this.#localProvider.registry.isNew;

			console.log(5);

			if (this.#parent.isOnline && this.#provider) {
				const response = await this.#publish(properties);
				this.#adapter.fromRemote(response);
				this.#localProvider.registry.isNew = false;
			}

			console.log(6);

			if (this.#localProvider) {
				await this.#localProvider.save(properties);
			}
			this.#parent.triggerEvent();

			return this.#adapter.toClient();
		} catch (e) {
			console.error('error saving', e);
			return e;
		}
	};
	publish = this.save;
	#publish = async (properties?) => {
		try {
			if (!this.#provider || !this.#bridge.get('isOnline')) return;

			let props = { ...properties };
			this.#parent.localFields.forEach(field => {
				delete props[field];
			});
			const response = await this.#provider.publish(props);

			const data = this.#adapter.fromRemote(response);

			if (this.#localProvider) {
				this.#localProvider.save(data);
				this.#localProvider.trigger('change');
			}
			return this.#adapter.toClient({ data });
		} catch (error) {
			console.error('ERROR PUBLISHING', error);
			return this.#adapter.toClient({ error });
		}
	};

	sync = () => {
		const provider = this.#getProperty('localProvider');

		if (!provider.registry.values.offline) {
			console.warn('registry already synced');
			return;
		}

		this.#publish(provider.registry.values);
		//const data = this.#getProperty("localProvider").store.where("offline").equals(true).toArray();
	};

	forceSync() {
		const provider = this.#getProperty('localProvider');
		const props = { ...provider.registry.values };

		this.#parent.localFields.forEach(field => {
			delete props[field];
		});

		this.#provider.publish(props);
	}
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

			return this.#adapter.toClient();
		} catch (e) {
			console.error('error updating locally', e);
		}
	};
}
