import { ReactiveProps } from '@beyond-js/reactive/model';
export type IItemProps<T> = ReactiveProps<T> & {
	id?: string | number;
	name: string;
};
