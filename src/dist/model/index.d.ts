import { ZodError, ZodObject, ZodTypeAny } from 'zod';
import { Events } from '@beyond-js/reactive/events';

type PropertyValidationErrors<T> = Partial<Record<keyof T, ValidatedPropertyType>>;
type IReactiveModelOptions<T> = {
    properties?: EntityProperty<T>[];
} & {
    [K in keyof T]?: any;
};
type Timeout = ReturnType<typeof setTimeout>;
interface ValidatedPropertyType {
    valid: boolean;
    error?: ZodError | null;
}
type SetPropertiesResult = {
    updated: boolean;
    errors?: PropertyValidationErrors<any>;
};
type EntityProperty<T> = keyof T | ReactiveObjectProperty<T>;
type DefaultProps = 'fetching' | 'fetched' | 'processing' | 'processed' | 'loaded';
/**
 * Represents a reactive property which is another ReactiveModel instance.
 */
type ReactiveObjectProperty<T> = {
    name: keyof T;
    value: any;
    properties: any;
};
type ReactiveProperty<T> = keyof T | DefaultProps | ReactiveObjectProperty<T> | string;

declare class ReactiveModel<T> extends Events {
    #private;
    debounceTimeout: Timeout | null;
    processing: boolean;
    processed: boolean;
    fetching: boolean;
    loaded: boolean;
    private _reactiveProps;
    static isReactive(): boolean;
    get isReactive(): boolean;
    protected properties: EntityProperty<T>[];
    get isDraft(): boolean;
    get propertyNames(): Set<unknown>;
    get ready(): boolean;
    set ready(value: boolean);
    protected schema: ZodObject<Record<string, ZodTypeAny>>;
    get initialValues(): Partial<T>;
    /**
     * Defines if the model has been modified since it was loaded.
     */
    get unpublished(): boolean;
    /**
     * @deprecated Use `unpublished` instead.
     */
    get isUnpublished(): boolean;
    constructor({ properties, ...props }?: IReactiveModelOptions<T>);
    /**
     * Logs debug information to the console only when the #debug property matches the constructor name.
     * This allows for targeted debugging of specific model instances by setting the #debug property
     * to the class name you want to debug.
     *
     * @param args - Any arguments to be logged to the console
     */
    private debug;
    /**
     * Sets the initial values for the model based on the provided specifications.
     * This method processes the model's properties and extracts their values from the specs object.
     * If no specs are provided, it returns the existing initial values.
     *
     * The method also determines if the model is a draft by checking if the specs object is empty.
     *
     * @param specs - Optional partial object containing property values to set as initial values
     * @returns The initial values object that was set
     */
    protected setInitialValues(specs?: Partial<T>): Partial<T>;
    getProperty<K extends keyof T>(key: K): T[K];
    property: <K extends keyof T>(key: K) => T[K];
    private isReactiveModel;
    private isCollectionModel;
    protected defineReactiveProp<K extends keyof T>(propKey: string, initialValue: any, model?: boolean): void;
    /**
     *  Defines the reactive properties of the object.
     * The properties are defined as an array of strings or objects.
     * The objects must have a `name` property with the name of the property and a `value` property with the class of the object.
     * The `value` property can be a class or an object.
     * If the `value` property is a class, the class must extend the `ReactiveModel` class.
     *
     * @param props
     * @param values
     */
    protected defineReactiveProps(props: ReactiveProperty<T>[], values?: any): void;
    protected reactiveProps(props: ReactiveProperty<T>[]): void;
    setProperty(propKey: string, value: any): void;
    private validateProperty;
    private isSameObject;
    /**
     * Validates the provided properties against the model's Zod schema.
     * Only validates properties that are defined in the model's properties array.
     *
     * @param {Partial<T>} properties - The properties to validate
     * @returns {{ valid: boolean; errors: PropertyValidationErrors<T> }} An object containing:
     *   - `valid`: boolean indicating if all properties are valid
     *   - `errors`: object containing validation errors for each invalid property
     */
    validate(properties: any): {
        valid: boolean;
        errors: PropertyValidationErrors<T>;
    };
    set(properties: Partial<T>): SetPropertiesResult;
    /**
     * Gets all properties of the model, including nested reactive objects and collections.
     * For collections, it returns the item properties instead of the collection instance.
     *
     * @returns {Partial<T>} An object containing all properties of the model
     */
    getProperties(): Partial<T>;
    /**
     * Reverts all properties of the model back to their initial values.
     * This is useful for discarding changes and restoring the model to its original state.
     */
    revert(): void;
    /**
     * Saves the current state of the model as the new initial state.
     * This marks the model as no longer being a draft and updates the initial values
     * to match the current state. Useful after successfully persisting changes.
     */
    saveChanges(): void;
    /**
     * Triggers an event after a specified delay.
     * @deprecated use trigger method instead.
     * @param {string} event - The name of the event to trigger.
     * @param {Record<string, any>} params - Additional parameters for the event, including an optional `delay` property.
     */
    triggerEvent: (event?: string, params?: Record<string, any>) => void;
}

export { ReactiveModel };
export type { IReactiveModelOptions, PropertyValidationErrors, SetPropertiesResult };
