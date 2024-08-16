import { ReactiveModel } from '@beyond-js/reactive/model';
export class Store extends ReactiveModel<Store> {
	#list;
	get list() {
		return this.#list;
	}
	#users;
	get users() {
		return this.#users;
	}
}
