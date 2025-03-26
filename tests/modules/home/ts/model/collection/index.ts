import { Collection } from '@beyond-js/reactive/entities/collection';
import { User } from '../item';
import { CollectionProvider } from './provider';

export class TestCollection extends Collection<User, CollectionProvider> {
	constructor() {
		super({ entity: 'User', item: User, provider: CollectionProvider });
	}

	async load() {
		const data = await super.load();

		return data;
	}

	async filter() {
		const data = await this.provider.filter({});

		return data;
	}
}

globalThis.Collection = TestCollection;
console.log(`Collection is being exposed as Collection in globaThis`);
