import { Item } from '@beyond-js/reactive/entities';
import { BookItemProvider } from '@beyond-js/reactive-tests/uses-cases/backend-providers/entities.bridge';

// This entity belongs to the use case of: entities with providers but no localDB

export /*bundle*/ class Book extends Item {
	protected properties = ['id', 'title', 'year'];

	constructor({ id = undefined }: { id?: string | undefined } = {}) {
		super({ id, storeName: 'books', db: 'test', localdb: false, provider: BookItemProvider });
	}
}
