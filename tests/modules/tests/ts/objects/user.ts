import { Item } from '@beyond-js/reactive/entities/item';
import { z } from 'zod';
interface IUser {
	name: string;
	lastName: string;
}
export class User extends Item<IUser> implements IUser {
	declare name: string;
	declare lastName: string;

	schema = z.object({
		name: z.string(),
		lastName: z.string(),
	});

	constructor() {
		super({
			properties: ['name', 'lastName'],
		});

		globalThis.u = this;
	}

	sayHello(name) {
		this.set({ name });
		console.log(this.name);
		this.triggerEvent('hello', { name });
	}
}
