import { Item } from '@beyond-js/reactive/entities';
import { UserProvider } from '@beyond-js/reactive/tests/backend/provider';
interface IBook {
	name?: string;
	password: string;
	lastnames: string;
}

export /*bundle */
class Book extends Item<IBook> {
	protected properties = ['id', 'title', 'author', 'year'];

	constructor({ id = undefined } = {}) {
		super({ id, storeName: 'book', db: 'test' });
	}
}
