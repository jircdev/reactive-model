import { Item, IItem } from '@beyond-js/reactive/entities';
// import { UserProvider } from '@beyond-js/reactive/tests/backend/provider';
import { Author } from 'author';
interface IBook extends IItem {
	name?: string;
	password: string;
	lastnames: string;
}

export interface IProvider {}
export /*bundle */
class Book extends Item<IBook, IProvider> {
	protected properties = [
		'id',
		'title',
		{
			type: Author,
		},
		'year',
	];

	constructor({ id = undefined } = {}) {
		super({ id, storeName: 'book', db: 'test' });
	}
}
