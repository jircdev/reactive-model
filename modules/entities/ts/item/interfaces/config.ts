import { TAdapters } from '../../adapter';
import { IProvider } from '../../interfaces/provider';

export interface IItemConfig<T = any> {
	storeName?: string;
	db?: string;
	id?: string | number;
	localdb?: boolean;
	properties?: { [key: string]: T };
	provider?: new (item?: any) => IProvider;
	adapter?: TAdapters;
}
