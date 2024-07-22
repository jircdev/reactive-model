import { ZodSchema, z } from 'zod';
import { ReactiveModel } from '@beyond-js/reactive/model';

interface IUser {
	name: string;
	lastName: string;
}
export class User extends ReactiveModel<IUser> implements IUser {
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
