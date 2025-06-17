import { Item } from '@beyond-js/reactive/entities/item';
import { ItemProvider } from './provider';

interface IUser {
	id: string;
	name: string;
}
export class User extends Item<IUser, ItemProvider> {
	constructor(specs = {}) {
		super({
			entity: 'User',
			provider: ItemProvider,
			properties: ['id', 'name'],
			...specs,
		});
	}

	async getData() {
		return await this.provider.getData();
	}
}

globalThis.Item = User;
console.log(`Item is being exposed as User in globaThis`);
