import { IResponseAdapter } from '../adapter/interface';
import type { Item } from './index';
import type { LocalProvider } from './local-provider';

export class ItemSaveManager {
	#parent: Item<any>;
	#getProperty;
	#bridge;
	#provider;
	#localProvider: LocalProvider;
	#localdb;
	#adapter: IResponseAdapter;
	constructor({ parent, bridge, localdb }) {
		this.#parent = parent;
		this.#getProperty = bridge.get;
		this.#bridge = bridge;
		this.#localdb = localdb;
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

			if (data) {
				await this.#parent.set(data);
			}

			if (!this.#parent.isUnpublished) return;

			const properties = { ...data, ...this.#parent.getProperties() };
			properties.isNew = this.#localProvider.registry.isNew;
			properties.__instanceId = this.#localProvider.registry.__instanceId;

			let remoteResponse;
			if (this.#parent.isOnline && this.#provider) {
				const response = await this.#publish(properties);
				if (!response.status) throw response;
				this.#localProvider.registry.setValues(response.data);
				properties.id = response?.data?.id;
				remoteResponse = response;
				this.#localProvider.registry.isNew = false;
			}

			if (this.#localProvider) {
				await this.#localProvider.save(properties);
			}
			this.#parent.triggerEvent();

			return this.#adapter.toClient({ data: remoteResponse });
		} catch (e) {
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
			await this.#parent.set(data);
			if (this.#localProvider) {
				this.#localProvider.save(data);
				if (props.id === this.#localProvider.registry.__instanceId) {
					this.#localProvider.deleteRegistry(props.id);
				}

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
				await this.#localProvider.save(properties);
			}

			this.#parent.triggerEvent();

			return this.#adapter.toClient();
		} catch (e) {
			console.error('error updating locally', e);
		}
	};
}
