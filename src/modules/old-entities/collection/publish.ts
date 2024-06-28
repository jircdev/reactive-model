import { Collection } from '.';
import { IResponseAdapter } from '../adapter/interface';
import { IProvider } from '../interfaces/provider';
import { Item } from '../item';
import type { LocalProvider } from '../item/local-provider';

export class CollectionSaveManager {
	#parent: Collection;
	#bridge: {
		get: (property: string) => any;
		set: (property: string, value: any) => void;
	};
	#localProvider: LocalProvider;
	#provider: IProvider;
	#localdb: boolean;

	#adapter: IResponseAdapter;
	constructor(
		parent: Collection,
		bridge: {
			get: (property: string) => any;
			set: (property: string, value: any) => void;
		},
	) {
		this.#parent = parent;
		this.#bridge = bridge;
		this.#adapter = this.#parent.responseAdapter;
		this.init();
	}

	init() {
		this.#localdb = this.#bridge.get('localdb');
		if (this.#localdb) {
			this.#localProvider = this.#bridge.get('localProvider');
		} else {
			// console.warn('The collection doesnt use LocalDB');
		}

		this.#provider = this.#bridge.get('provider');
	}

	/**
	 *
	 * @param data elements to save
	 * @param init  lets define if the elements to save will work as a list of elements in the collection when is instanced
	 * @returns
	 */
	save = async (data = [], init = false): Promise<boolean | void> => {
		if (!this.#localdb) return true;

		await this.#localProvider.init();

		await this.#localProvider.save(data);
	};

	publish = async (data = []): Promise<unknown> => {
		try {
			await this.save(data);
			if (!this.#provider || this.#bridge.get('isOffline')) return;

			const response = await this.#provider.bulkSave(data);

			if (!response.status) throw response.error;

			return this.#adapter.toClient({ status: true });
		} catch (error) {
			console.error(error);
			return this.#adapter.toClient({ error });
		}
	};

	// Send chunks with retries
}
