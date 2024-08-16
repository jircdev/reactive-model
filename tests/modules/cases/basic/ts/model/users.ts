import { Collection } from '@beyond-js/reactive/entities/collection';
import { CollectionService } from './service';
import { User } from './user';

export class Users extends Collection {
	constructor() {
		super({
			entity: 'users',
			service: CollectionService,
			item: User,
		});
	}
}

globalThis.User = User;
console.log('Users Collection has been defined in globalThis.Users variable.');
