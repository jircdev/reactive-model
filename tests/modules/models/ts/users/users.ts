import { Collection } from '@beyond-js/reactive/entities';
import { User } from './index';
import { UserProvider } from '@beyond-js/reactive-tests/backend/provider';

export /*bundle*/ class Users extends Collection {
	constructor() {
		super({ storeName: 'user', db: 'test', item: User, provider: UserProvider });
	}
}
