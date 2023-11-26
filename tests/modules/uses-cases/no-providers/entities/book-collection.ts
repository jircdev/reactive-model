import { Collection } from '@beyond-js/reactive/entities';
import { Book } from './book-item';

// This entity belongs to the use case of: entities with no providers but with localDB

export /*bundle*/ class Books extends Collection {
	constructor() {
		super({ storeName: 'books', db: 'test', item: Book, localdb: false });
	}
}
