import { Collection } from '../';

export interface IInternalCollectionParams {
	parent: Collection;
	localdb: boolean;
	bridge: {
		get: (property: string) => any;
		set: (property: string, value: any) => void;
	};
}
