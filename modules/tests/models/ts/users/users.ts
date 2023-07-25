import { Collection } from '@beyond-js/reactive-2/entities';
import { User } from './index';
import { UserProvider } from '@beyond-js/reactive-2/tests/backend/provider';
interface IUsers {
	items: User[];
}
export /*bundle*/ class Users extends Collection {
	item = User;

	constructor() {
		super({ storeName: 'user', db: 'test', provider: UserProvider, item: User });
	}
}
