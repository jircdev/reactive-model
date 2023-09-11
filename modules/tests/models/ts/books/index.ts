import { Item, IItem } from '@beyond-js/reactive-2/entities';
import { UserProvider } from '@beyond-js/reactive-2/tests/backend/provider';
interface IBook extends IItem {
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
