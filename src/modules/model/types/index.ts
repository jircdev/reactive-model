import { ZodError } from 'zod';
export /*bundle*/ type ModelProperties<T> = Partial<T>;
export type PropertyValidationErrors<T> = Partial<Record<keyof T, ValidatedPropertyType>>;

/**
 * Computed property definition for ReactiveModel.
 * Allows defining derived properties that automatically recalculate when dependencies change.
 */
export /*bundle*/ interface ComputedProperty<T> {
	/** Name of the computed property */
	name: keyof T | string;
	/** Properties that this computed property depends on */
	dependencies: (keyof T | string)[];
	/** Function to compute the value */
	compute: (model: unknown) => unknown;
}

export /*bundle*/ type IReactiveModelOptions<T> = {
	properties?: EntityProperty<T>[];
	/** Computed properties that derive from other properties */
	computed?: ComputedProperty<T>[];
} & {
	[K in keyof T]?: T[K];
};

export type Timeout = ReturnType<typeof setTimeout>;

export interface ValidatedPropertyType {
	valid: boolean;
	error?: ZodError | null;
}
export interface TriggerEventParams {
	event: string;
	delay?: number;
	specs?: Record<string, unknown>;
}

export type TriggerEventInput = string | TriggerEventParams;

export /*bundle*/ type SetPropertiesResult = {
	updated: boolean;
	errors?: PropertyValidationErrors<unknown>;
};

export type EntityProperty<T> = keyof T | ReactiveObjectProperty<T>;

export type DefaultProps = 'fetching' | 'fetched' | 'processing' | 'processed' | 'loaded';

/**
 * Represents a reactive property which is another ReactiveModel instance.
 */
export type ReactiveObjectProperty<T> = { 
	name: keyof T; 
	value: new (...args: unknown[]) => unknown; 
	properties?: Record<string, unknown>; 
};

export type ReactiveProperty<T> = keyof T | DefaultProps | ReactiveObjectProperty<T> | string;

/**
 * Lifecycle hooks for ReactiveModel set operations.
 * These hooks allow intercepting and modifying data before/after set operations.
 */
export /*bundle*/ interface ILifecycleHooks<T> {
	/** Called before set() - can modify properties before they are applied */
	beforeSet?(properties: Partial<T>): Partial<T> | Promise<Partial<T>>;
	/** Called after set() - receives the properties and result */
	afterSet?(properties: Partial<T>, result: SetPropertiesResult): void | Promise<void>;
}
