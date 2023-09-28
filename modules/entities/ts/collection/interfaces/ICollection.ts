import type { Item } from '../../item';
import { IProvider, IProviderConstructor } from '../../interfaces/provider';
import { TAdapters } from '../../adapter';

export type TItemConstructor<T extends object = any> = new (args?: { id?: any }) => Item<T>;

export interface ICollection {
	items: object[];
	item: TItemConstructor;
	next: number | undefined;
	provider: TItemConstructor;
}

export interface ICollectionSpecs {
	provider: IProviderConstructor;
	storeName: string;
	db: string;
	localdb?: boolean;
	item: TItemConstructor<any>;
	adapter?: TAdapters;
}
