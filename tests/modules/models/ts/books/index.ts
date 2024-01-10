import { Item, IItem } from '@beyond-js/reactive/entities';
// import { Author } from 'author';
import { BookProvider } from '@beyond-js/reactive-tests/backend/provider';

interface IBook extends IItem {
	name?: string;
	password: string;
	lastnames: string;
}

export interface IProvider {}
export /*bundle */
class Book extends Item<IBook, IProvider> {
	protected properties = ['id', 'title', 'year'];

	constructor({ id = undefined }: { id?: string | undefined; localdb?: boolean } = {}) {
		super({ id, storeName: 'book', db: 'test', provider: BookProvider });
	}
}
