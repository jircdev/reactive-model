import { Item, IItemProps } from '@beyond-js/reactive/entities/item';

// Generic persistence service interface
export interface DefaultApiResponse<T> {
	status: string;
	data?: T[];
	error?: string;
}

export interface PersistenceService<T> {
	load(criteria: Partial<T>): Promise<DefaultApiResponse<T>>;
	save(items: T[]): Promise<void>;
	delete(ids: (string | number)[]): Promise<void>;
}

// Type for collection items
export type CollectionItem<T> = new (props: IItemProps<T>) => Item<T>;

// Parameters for the collection constructor
export interface ICollectionParams<T, S extends PersistenceService<T>> {
	Item: CollectionItem<T>;
	service: new () => S; // Ensure service is a class constructor
}
