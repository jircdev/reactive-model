import { Item } from '../item/index';
import { IItem } from '../item/interfaces/item';

class UserProvider {}
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
