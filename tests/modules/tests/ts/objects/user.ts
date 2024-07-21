import { ReactiveModel } from '@beyond-js/reactive/model';

interface IUser {
	name: string;
	lastName: string;
}
export class User extends ReactiveModel<IUser> implements IUser {
	name: string;
	lastName: string;

	constructor() {
		super({
			properties: ['name', 'lastName'],
		});

		globalThis.u = this;
	}

	sayHello() {
		console.log(this.name);
	}
}
