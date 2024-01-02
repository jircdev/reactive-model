import { Collection } from '@beyond-js/reactive/entities';
import { Book } from './book-item';

// This entity belongs to the use case of: entities with no providers but with indexedDB as a center of data

export /*bundle*/ class Books extends Collection {
	constructor() {
		super({ storeName: 'books', db: 'test', item: Book, localdb: true });
	}
}
