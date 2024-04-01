import { TAdapters } from '../../adapter';
import { IProvider } from '../../interfaces/provider';

export interface IItemConfig {
	storeName?: string;
	db?: string;
	id?: string | number;
	localdb?: boolean;
	// properties?: { [key: string]: T };
	properties?: string[];
	provider?: new (item?: any) => IProvider;
	adapter?: TAdapters;
}
