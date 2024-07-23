import { ReactiveModel } from '@beyond-js/reactive/model';
import { User } from './objects/user';

export class Store extends ReactiveModel<Store> {
	#list;
	get list() {
		return this.#list;
	}
	#users;
	get users() {
		return this.#users;
	}
	#model: User;
	constructor() {
		super();
		this.load();
		globalThis.store = this;
	}

	async load() {
		const user = new User();
		this.#model = user;
	}

	getInstance(specs) {
		return new User({ ...specs });
	}
}
