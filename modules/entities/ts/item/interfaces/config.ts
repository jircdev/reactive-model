import { IProvider } from '../../interfaces/provider';

export interface IItemConfig {
	storeName?: string;
	db?: string;
	id?: string | number;
	provider?: new () => IProvider;
}
