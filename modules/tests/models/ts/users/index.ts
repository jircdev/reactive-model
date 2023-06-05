import { Item } from '@beyond-js/reactive-2/entities';
import { UserProvider } from '@beyond-js/reactive-2/tests/backend/provider';
interface IUser {
	name?: string;
	password: string;
	lastnames: string;
}

export /*bundle */
class User extends Item<IUser> {
	protected properties = ['id', 'name', 'lastname'];

	constructor({ id = undefined } = {}) {
		super({ storeName: 'user', db: 'test', id });
		this.provider = new UserProvider();
	}
}
