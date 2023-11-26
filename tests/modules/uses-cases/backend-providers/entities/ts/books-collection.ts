import { Collection } from '@beyond-js/reactive/entities';
import { Book } from './book-item';
import { BookCollectionProvider } from '@beyond-js/reactive-tests/uses-cases/backend-providers/entities.bridge';

// This entity belongs to the use case of: entities with providers but no localDB

export /*bundle*/ class Books extends Collection {
	constructor() {
		super({ storeName: 'books', db: 'test', item: Book, localdb: false, provider: BookCollectionProvider });
	}
}
