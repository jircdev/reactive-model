import { IProvider } from '../../interfaces/provider';

export interface IItemConfig {
	storeName?: string;
	db?: string;
	id?: string | number;
	localdb?: boolean;
	provider?: new () => IProvider;
}
