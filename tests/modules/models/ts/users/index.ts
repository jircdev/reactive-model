import { Item, IItem } from '@beyond-js/reactive/entities';
import { UserProvider } from '@beyond-js/reactive-tests/backend/provider';

interface IUser {
	name?: string;
	password: string;
	lastnames: string;
}
interface ISpecs {
	id?: string;
}
export /*bundle */
class User extends Item<IUser> {
	protected properties = ['id', 'name', 'lastnames'];

	constructor({ id = undefined }: ISpecs = {}) {
		super({ storeName: 'user', db: 'test', id, provider: UserProvider });
	}
}
