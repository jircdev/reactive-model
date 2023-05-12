import type { LocalProvider } from "../item/local-provider";

export class CollectionSaveManager {
	#parent;
	#bridge;
	#localProvider: LocalProvider;
	#provider;
	#localdb;
	protected MAX_RETRIES = 3;
	protected CHUNK_SIZE = 200;

	constructor(parent, bridge) {
		this.#parent = parent;
		this.#bridge = bridge;
		this.init();
	}

	init() {
		this.#parent.save = this.save;
		this.#parent.sync = this.sync;
		this.#parent.publish = this.publish;
		this.#parent.toSync = this.toSync;

		this.#localdb = this.#bridge.get("localdb");
		if (this.#localdb) {
			this.#localProvider = this.#bridge.get("localProvider");
		} else {
			console.warn("la colleccion no usa indexeddb");
		}

		this.#provider = this.#bridge.get("provider");
	}

	save = async (data = []): Promise<any> => {
		if (!this.#localdb) return true;
		await this.#localProvider.init();

		await this.#localProvider.save(data);
	};

	publish = async (data = []): Promise<any> => {
		try {
			await this.save(data);
			if (!this.#provider || this.#bridge.get("isOffline")) return;

			const response = await this.#provider.bulkSave(data);
			if (!response.status) throw response.error;

			return { status: true };
		} catch (error) {
			console.error(error);
			return { status: false, error };
		}
	};

	// Send chunks with retries
	sendChunk = async (chunk, index, retries = 0) => {
		try {
			const response = await this.#provider.bulkSave(chunk);

			if (response.status) {
				const data = response.data.entries.map(item => ({ ...item, offline: 0, instanceId: undefined }));

				await this.#localProvider.upsert(data, chunk);
				return { success: true, chunk, response };
			}
			if (retries < this.MAX_RETRIES) {
				return await this.sendChunk(chunk, retries + 1);
			}

			return { success: false, chunk, response };
		} catch (e) {
			console.error(e);
			return { success: false, chunk, error: e };
		}
	};

	// Split large datasets into smaller chunks
	splitDataIntoChunks = data => {
		const chunks = [];
		for (let i = 0; i < data.length; i += this.CHUNK_SIZE) {
			chunks.push(data.slice(i, i + this.CHUNK_SIZE));
		}
		return chunks;
	};

	sync = async () => {
		try {
			await this.#localProvider.init();
			const data = await this.#parent.localProvider.store.where("offline").equals(1).toArray();

			const chunks = this.splitDataIntoChunks(data);

			const failedChunks = [];

			for (const [index, chunk] of chunks.entries()) {
				const result = await this.sendChunk(chunk, index);

				if (!result.success) {
					failedChunks.push(result);
				}
			}
			this.#bridge.set("items", []);
			await this.#parent.load();
			if (failedChunks.length) {
				const message = failedChunks.length === chunks.length ? "FAILED_SYNC" : "INCOMPLETE_SYNC";
				return { status: false, message, data: failedChunks };
			}

			return data;
		} catch (e) {
			console.error(e);
		}
	};

	toSync = async () => {
		try {
			await this.#localProvider.init();

			return this.#localProvider.store.where("offline").equals(1).toArray();
		} catch (e) {
			console.error(e);
		}
	};
}
