import { BookStore } from '@beyond-js/reactive-tests/backend/database';

// This provider belongs to the use case of: entities with providers but no localDB

export /*actions*/ /*bundle*/ class BookCollectionProvider {
	#model: BookStore = new BookStore();

	async list(params) {
		const response = await this.#model.loadAll(params);
		return { status: true, data: { entries: response } };
	}
}
