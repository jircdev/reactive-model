import type { ResponseAdapter } from '../adapter';
import { IResponseAdapter } from '../adapter/interface';
import type { LocalProvider } from '../item/local-provider';

export class CollectionSaveManager {
	#parent;
	#bridge;
	#localProvider: LocalProvider;
	#provider;
	#localdb;
	protected MAX_RETRIES = 3;
	protected CHUNK_SIZE = 200;
	#adapter: IResponseAdapter;
	constructor(parent, bridge) {
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
			console.warn('la colleccion no usa indexeddb');
		}

		this.#provider = this.#bridge.get('provider');
	}

	save = async (data = []): Promise<any> => {
		if (!this.#localdb) return true;
		await this.#localProvider.init();
		await this.#localProvider.save(data);
	};

	publish = async (data = []): Promise<any> => {
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
	sendChunk = async chunk => {
		const response = await this.#provider.bulkSave(chunk);

		// Esto es lo que aveces no se ejecuta (el metodo bulkSave del provider tampoco)

		if (response.status) {
			const data = response.data.entries.map(item => ({ ...item, offline: 0, instanceId: undefined }));

			await this.#localProvider.upsert(data, chunk);
			return { success: true, chunk, response };
		}

		return { success: false, chunk, response };
	};

	// Split large datasets into smaller chunks
	splitDataIntoChunks = data => {
		const chunks = [];
		for (let i = 0; i < data.length; i += this.CHUNK_SIZE) {
			chunks.push(data.slice(i, i + this.CHUNK_SIZE));
		}
		return chunks;
	};

	sync = async data => {
		await this.#localProvider.init();
		if (!data) data = await this.#parent.localProvider.store.where('offline').equals(1).toArray();

		const chunks = this.splitDataIntoChunks(data);
		const failedChunks = [];
		const successChunks = [];

		for (const [index, chunk] of chunks.entries()) {
			const result = await this.sendChunk(chunk);
			if (!result.success) {
				failedChunks.push(result);
			} else successChunks.push(result);
		}

		this.#bridge.set('items', []);
		await this.#parent.load();
		if (failedChunks.length) {
			const message = failedChunks.length === chunks.length ? 'FAILED_SYNC' : 'INCOMPLETE_SYNC';

			return this.#adapter.toClient({ data: { failed: failedChunks, success: successChunks, error: message } });
		}

		return this.#adapter.toClient({ data: successChunks });
	};

	toSync = async () => {
		try {
			await this.#localProvider.init();
			return this.#localProvider.store.where('offline').equals(1).toArray();
		} catch (e) {
			console.error(e);
		}
	};
}
