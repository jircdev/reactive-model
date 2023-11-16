import { Item } from '@beyond-js/reactive/entities';

export /*bundle*/ class Book extends Item {
	protected properties = ['id', 'title', 'year'];

	constructor({ id = undefined }: { id?: string | undefined } = {}) {
		super({ id, storeName: 'books', db: 'test', localdb: true });
	}
}
