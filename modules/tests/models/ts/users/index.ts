import { Item } from '@beyond-js/reactive/entities';
import { UserProvider } from '@beyond-js/reactive/tests/backend/provider';
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
