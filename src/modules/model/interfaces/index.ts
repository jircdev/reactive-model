import { ZodError } from 'zod';
export type ModelProperties<T> = Record<keyof T, any>;
export type PropertyValidationErrors<T> = Partial<Record<keyof T, ValidatedPropertyType>>;

export /*bundle*/ type ReactiveProps<T> = {
	properties?: (keyof T)[];
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
	errors: PropertyValidationErrors<any>;
};
