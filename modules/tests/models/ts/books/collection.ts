import { Collection } from '@beyond-js/reactive-2/entities';
import { Book } from './index';
import { UserProvider } from '@beyond-js/reactive-2/tests/backend/provider';
interface IUsers {
	items: Book[];
}
export /*bundle*/ class Books extends Collection {
	constructor() {
		super({ provider: UserProvider, storeName: 'books', db: 'test', item: Book });
	}
}
