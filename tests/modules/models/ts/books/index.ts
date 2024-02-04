import { Item, IItem } from '@beyond-js/reactive/entities';
// import { Author } from 'author';
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
		// {
		// 	type: Author,
		// },
		'year',
	];

	constructor({ id = undefined, localdb = true }: { id?: string | undefined; localdb?: boolean } = {}) {
		super({ id });
	}
}
