import { ReactiveModel } from '@beyond-js/reactive/model';
import { Users } from '@beyond-js/reactive/examples/models';
export class Store extends ReactiveModel<Store> {
	#users: Users = new Users();

	#list;
	get list() {
		return this.#list;
	}
	get users() {
		return this.#users;
	}

	#ready = false;
	get ready() {
		return this.#ready;
	}

	constructor() {
		super();
	}

	getList = async () => {
		try {
			const list = await fetch('https://odds.p.rapidapi.com/v4/sports');
			this.#ready = true;
			this.#list = list;
		} catch (e) {
			console.log(e);
		}
	};
}
