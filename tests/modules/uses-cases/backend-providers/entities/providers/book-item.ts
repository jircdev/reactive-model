import { BookStore } from '@beyond-js/reactive-tests/backend/database';

// This provider belongs to the use case of: entities with providers but no localDB

export /*actions*/ /*bundle*/ class BookItemProvider {
	#model: BookStore = new BookStore();

	async publish(params) {
		const response = await this.#model.storeBook(params);
		return { status: true, data: response };
	}
}
