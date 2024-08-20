import { ReactiveModel } from '@beyond-js/reactive/model';
import { CollectionItem, DefaultApiResponse, ICollectionParams, PersistenceService } from './types';

// Abstract Collection class with generic return types
export /*bundle*/ abstract class Collection<T, S extends PersistenceService<T>> extends ReactiveModel<
	Collection<T, S>
> {
	#item: CollectionItem<T>;
	protected service: S;

	constructor({ Item, service, ...props }: ICollectionParams<T, S>) {
		super();
		this.#item = Item;
		this.service = new service(); // Correctly instantiate the service here
	}

	// Generic abstract methods for subclasses to define return types
	async load<R = DefaultApiResponse<T>>(params: Partial<T>): Promise<R> {
		const response = await this.service.load(params);
		return response as R;
	}
	abstract save<R = any>(specs: Partial<T>): Promise<R>;
	abstract publish<R = any>(): Promise<R>;
	abstract delete<R = any>(): Promise<R>;
}
