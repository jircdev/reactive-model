import { ZodError } from 'zod';
export /*bundle*/ type ModelProperties<T> = any;
export type PropertyValidationErrors<T> = Partial<Record<keyof T, ValidatedPropertyType>>;

export /*bundle*/ type IReactiveModelOptions<T> = {
	properties?: EntityProperty<T>[];
} & {
	[K in keyof T]?: any;
};

export type Timeout = ReturnType<typeof setTimeout>;

export interface ValidatedPropertyType {
	valid: boolean;
	error?: ZodError | null;
}
export interface TriggerEventParams {
	event: string;
	delay?: number;
	specs?: any;
}

export type TriggerEventInput = string | TriggerEventParams;

export /*bundle*/ type SetPropertiesResult = {
	updated: boolean;
	errors?: PropertyValidationErrors<any>;
};

export type EntityProperty<T> = keyof T | ReactiveObjectProperty<T>;

export type DefaultProps = 'fetching' | 'fetched' | 'processing' | 'processed' | 'loaded';
/**
 * Represents a reactive property which is another ReactiveModel instance.
 */
export type ReactiveObjectProperty<T> = { name: keyof T; value: any; properties: any };
export type ReactiveProperty<T> = keyof T | DefaultProps | ReactiveObjectProperty<T> | string;
