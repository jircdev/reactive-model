export type RegistryId = string | number;
export type ReactiveProperty<T> = keyof T | { name: keyof T };
export type RegistryData<T> = {
	id?: string | number;
	instanceId?: string;
	properties: ReactiveProperty<T>[];
};
