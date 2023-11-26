import { BookStore } from '@beyond-js/reactive-tests/backend/database';

// This provider belongs to the use case of: entities with providers but no localDB

export /*actions*/ /*bundle*/ class BookItemProvider {
	#model: BookStore = new BookStore();

	async publish(params) {
		console.log(1, params);
		const response = await this.#model.storeBook(params);
		console.log(2, response);
		return { status: true, data: response };
	}
}
