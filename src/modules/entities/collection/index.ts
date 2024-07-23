import { ReactiveModel } from '@beyond-js/reactive/model';
import { Item } from '@beyond-js/reactive/entities/item';
export /*bundle */ class Collection extends ReactiveModel<Collection> {
	#item: Item;
	constructor({ item: Item, ...props }) {
		super();
		console.log(20, 'collection');
		this.#item = Item;
	}

	load() {
		console.log('loading collection');
	}

	save() {
		console.log('saving collection');
	}

	publish() {
		console.log('publishing collection');
	}

	delete() {
		console.log('deleting collection');
	}
}
