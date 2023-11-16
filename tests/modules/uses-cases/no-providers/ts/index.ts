import { Book, Books } from '@beyond-js/reactive-tests/examples/models';

export /*bundle*/ class NoProvidersUseCase {
	static execute = async () => {
		const response = await this.#createBook();
		console.log('RESPONSE 1 => ', response);
		const collectionResponse = await this.#load();
		console.log('RESPONSE 2 => ', collectionResponse);
	};

	static #createBook = async () => {
		const book = new Book({ localdb: false });
		console.log('BOOK 1 +> ', book);
		await book.set({ name: 'El principe de Berlin' });
		console.log('BOOK 2 +> ', book);
		return book.publish();
	};

	static #load = async () => {
		const collection = new Books({ localdb: true });
		return collection.load();
	};
}
