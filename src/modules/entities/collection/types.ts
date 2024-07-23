import { Item, IItemProps } from '@beyond-js/reactive/entities/item';

export type CollectionItem<T> = new (props: IItemProps<T>) => Item<T>;
export interface ICollectionParams<T> {
	Item: CollectionItem<T>;
}
