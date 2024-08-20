export type RegistryData<T> = T & {
	id?: string | number;
	__instanceId?: string | number;
	properties: (keyof T)[];
};

export type RegistryId<T> = RegistryData<T>['id'] | RegistryData<T>['__instanceId'];
export type RegistryDataValue<T> = Omit<RegistryData<T>, 'properties'>;
