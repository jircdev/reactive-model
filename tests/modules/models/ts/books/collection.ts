import { Collection } from '@beyond-js/reactive/entities';
import { Book } from './index';
// import { UserProvider } from '@beyond-js/reactive/tests/backend/provider';

export /*bundle*/ class Books extends Collection {
	constructor({ localdb = false }: { localdb?: boolean }) {
		super({ storeName: 'books', db: 'test', item: Book, localdb });
	}
}
