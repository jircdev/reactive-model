export class LocalProviderSaver {
	/**
	 *
	 * @param data
	 * @returns
	 */
	async save(data): Promise<any> {
		const process = (entries, offline = 0) => {
			return entries.map(item => {
				const record =
					item.getProperties && typeof item.getProperties === 'function' ? item.getProperties() : item;
				const toSave = { ...record, offline, instanceId: item.instanceId };
				return toSave;
			});
		};

		data = process(data, this.isOnline ? 0 : 1);

		if (!this.#apply) return;
		await this.#registryFactory.init();
		await this.saveAll(data, this.#storeName);
	}

	/**
	 * Saves a collection of items to the specified store in batches.
	 *
	 * @param {Array} items - The items to be saved.
	 * @param {string} storeName - The name of the store where items will be saved.
	 * @returns {Promise<{ status: boolean, failed?: Array }>} An object containing the status of the operation.
	 * If the status is true, all batches have been saved successfully. If the status is false, the failed property contains an array with information about failed batches.
	 * Each failed batch object has a status, a reason (if the batch is rejected), an index (the original batch position), and data (the failed batch data).
	 * @throws Will throw an error if there's an issue with the Promise.allSettled() call itself.
	 */

	async saveAll(items, storeName) {
		if (!this.#apply) return;
		const elements = items.map(item => {
			const registry = new Registry(storeName);
			if (item.deleted) {
				registry.isDeleted = true;
			}
			registry.setValues(item);
			return registry;
		});

		const store = this.#database.db[storeName];
		const promises = [];
		const chunks = [];

		while (elements.length > 0) {
			const batch = elements.splice(0, this.#batches);
			const data = batch.map(item => item.getValues());
			chunks.push(data);

			promises.push(store.bulkPut(data));
		}
		try {
			const results = await Promise.allSettled(promises);
			const mappedFn = (result, index) => ({ ...result, index, data: chunks[index] });
			const failed = results.map(mappedFn).filter(result => result.status === 'rejected');
			if (!failed.length) return { status: true };
			else {
				return { status: false, failed };
			}
		} catch (e) {
			return { status: false, failed: e };
		}
	}
}
