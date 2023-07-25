import { ReactiveModel } from '@beyond-js/reactive-2/model';
import { Users, User } from '@beyond-js/reactive-2/examples/models';
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
		this.#users = new Users();
		// this.#users.setOffline(true);
		this.#users.on('change', this.triggerEvent.bind(this));
		this.load();
	}

	async load() {
		await this.#users.load();

		this.ready = true;
	}

	async deleteUser(id: string) {
		const user = new User({ id });
		await user.load();
		await user.delete();
		this.triggerEvent();
	}

	async deleteItems(ids: number[]) {
		await this.#users.delete(ids);
		this.triggerEvent();
	}
}
