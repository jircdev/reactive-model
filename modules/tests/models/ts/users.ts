import { ReactiveModel } from '@beyond-js/reactive-2/model';
import { Collection } from '@beyond-js/reactive-2/entities';
import { User } from './user';
import { UserProvider } from '@beyond-js/reactive-2/tests/backend/provider';
interface IUsers {
	items: User[];
}
export /*bundle*/ class Users extends Collection {
	item = User;
	protected storeName = 'user';
	protected db = 'test';
	protected localdb = false;
	constructor() {
		super();
		this.provider = new UserProvider();
		this.init();
	}
}
