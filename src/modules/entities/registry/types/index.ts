export interface IRegistry {
	id?: string | number;
	__instanceId?: string | number;
	[key: string]: any;
}

export type RegistryId = IRegistry['id'];

export interface IRegistryFactory<T, Record> {
	registries: Map<string, Map<RegistryId, Record>>;
}
