import { Item } from '@beyond-js/reactive/entities';
// This entity belongs to the use case of: entities with no providers but with indexedDB as a center of data

export /*bundle*/ class Book extends Item {
	protected properties = ['id', 'title', 'year'];

	constructor({ id = undefined }: { id?: string | undefined } = {}) {
		super({ id, storeName: 'books', db: 'test', localdb: true });
	}
}
