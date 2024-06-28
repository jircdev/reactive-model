/**
 * Interface for initial values that matches the structure of the generic type passed to the instance.
 * This interface defines a type that can hold any set of properties based on the provided generic type,
 * with their values being of the corresponding type. This enforces type safety by ensuring that the object
 * used as initial values has properties that exist on the generic type T, with each property being optional.
 *
 * @template T - The generic type representing the structure of the object, specifying properties and their types.
 */
export interface IInitialValues<T> {
	[key: string]: any;
}
