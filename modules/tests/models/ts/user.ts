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

	protected storeName = 'user';
	protected db = 'test';

	constructor({ id = undefined } = {}) {
		super(id);
		this.provider = new UserProvider();
		this.init({ id });
	}
}
