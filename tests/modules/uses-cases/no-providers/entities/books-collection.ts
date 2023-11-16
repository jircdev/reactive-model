import { Collection } from '@beyond-js/reactive/entities';
import { Book } from './book-item';

export /*bundle*/ class Books extends Collection {
	constructor() {
		super({ storeName: 'books', db: 'test', item: Book, localdb: true });
	}
}
