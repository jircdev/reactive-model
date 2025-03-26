import { ReactiveModel } from '@beyond-js/reactive/model';

interface IUser {
	id: string;
	name: string;
	data: any;
}
export class User extends ReactiveModel<IUser> {
	constructor() {
		super({
			properties: [
				'id',
				'name',
				{
					name: 'data',
				},
			],
		});
	}
}

globalThis.Model = User;
console.log(`Model is being exposed as User in globaThis`);
