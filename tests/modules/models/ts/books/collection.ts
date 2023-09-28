import { Collection } from '@beyond-js/reactive/entities';
import { Book } from './index';
import { UserProvider } from '@beyond-js/reactive/tests/backend/provider';
interface IUsers {
	items: Book[];
}
export /*bundle*/ class Books extends Collection {
	constructor() {
		super({ provider: UserProvider, storeName: 'books', db: 'test', item: Book });
	}
}
