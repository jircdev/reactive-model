import { Item } from '@beyond-js/reactive/entities/item';
import { z } from 'zod';
interface IUser {
	id: string | number;
	name: string;
	lastName: string;
}
export class User extends Item<IUser> {
	declare name: string;
	declare lastName: string;
	protected static entity = 'User';

	schema = z.object({
		id: z.union([z.string(), z.number()]),
		name: z.string(),
		lastName: z.string(),
	});

	constructor(args: { id?: string | number } = {}) {
		super({
			...args,
			entity: 'User',
			properties: ['id', 'name', 'lastName'],
		});
	}
}

globalThis.User = User;
console.log('User class has been defined in globalThis.User variable.');
