import { ReactiveModel } from '@beyond-js/reactive/model';
import { RegistryFactory } from '@beyond-js/reactive/entities/registry';
import { IItemProps } from './types';

//your code here
export /*bundle*/ class Item<T> extends ReactiveModel<T> {
	#factory: RegistryFactory;
	constructor(args: IItemProps) {
		super();
		this.#factory = RegistryFactory.get(args.name);
		console.log(0.1, this.#factory);
	}
}
