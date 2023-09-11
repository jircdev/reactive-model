import { Item, IItem } from '@beyond-js/reactive-2/entities';
import { UserProvider } from '@beyond-js/reactive-2/tests/backend/provider';

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
	protected properties = ['id', 'name', 'lastname'];

	constructor({ id = undefined }: ISpecs) {
		super({ storeName: 'user', db: 'test', id, provider: UserProvider });
	}
}
