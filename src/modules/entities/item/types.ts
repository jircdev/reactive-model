import { ReactiveProps } from '@beyond-js/reactive/model';

export type ItemId = string | number;
export /*bundle*/ type IItemProps<T> = Partial<ReactiveProps<T>> & {
	id?: ItemId;
	entity?: string; // Making 'entity' optional
};
