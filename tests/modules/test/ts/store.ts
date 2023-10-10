import { ReactiveModel } from '@beyond-js/reactive/model';
import { Users, User } from '@beyond-js/reactive-tests/examples/models';
export class Store extends ReactiveModel<Store> {
	#list;
	get list() {
		return this.#list;
	}
	#users;
	get users() {
		return this.#users;
	}

	constructor() {
		super();
		this.load();
	}

	async load() {}
}
