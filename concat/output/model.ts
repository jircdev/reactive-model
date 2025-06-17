/**
 * File: index.ts
 */
import { ZodError, ZodTypeAny, ZodObject } from "zod";
import {
  ValidatedPropertyType,
  ModelProperties,
  PropertyValidationErrors,
  SetPropertiesResult,
  Timeout,
  ReactiveObjectProperty,
  DefaultProps,
  IReactiveModelOptions,
  ReactiveProperty,
  EntityProperty,
} from "./types";

import { Events } from "@beyond-js/events/events";

export /*bundle */ class ReactiveModel<T> extends Events {
  debounceTimeout: Timeout | null;
  processing: boolean = false;
  processed: boolean = false;
  declare fetching: boolean;
  loaded: boolean = false;
  #ready: boolean = false;

  private _reactiveProps: Record<keyof T, any> = {} as Record<keyof T, any>;
  static isReactive() {
    return true;
  }
  get isReactive() {
    return true;
  }
  //TODO: Validate how to handle the properties
  protected properties: EntityProperty<T>[] = [];
  // properties of the object
  #isDraft: boolean = false;
  get isDraft() {
    return this.#isDraft;
  }
  #propertyNames = new Set();
  get ready() {
    return this.#ready;
  }
  set ready(value: boolean) {
    this.#ready = value;
    this.trigger("ready");
    this.trigger("change");
  }

  protected schema: ZodObject<Record<string, ZodTypeAny>>;
  #initialValues: Partial<T> = {} as Partial<T>;

  get initialValues() {
    return this.#initialValues;
  }

  /**
   * Defines if the model has been modified since it was loaded.
   */
  get unpublished(): boolean {
    const properties = this.getProperties() ?? {};
    return Object.keys(properties).some((prop) => {
      if (prop === "id") return false;
      if (Array.isArray(properties[prop])) {
        if (properties[prop].length !== this.#initialValues[prop]?.length)
          return true;
        return (
          JSON.stringify(properties[prop]) !==
          JSON.stringify(this.#initialValues[prop])
        );
      }
      if (typeof properties[prop] === "object") {
        if (this[prop] instanceof ReactiveModel) {
          return this[prop].unpublished;
        }

        return (
          JSON.stringify(properties[prop]) !==
          JSON.stringify(this.#initialValues[prop])
        );
      }

      return properties[prop] !== this.#initialValues[prop];
    });
  }
  /**
   * @deprecated Use `unpublished` instead.
   */
  get isUnpublished() {
    return this.unpublished;
  }

  constructor(
    { properties, ...props }: IReactiveModelOptions<T> = {
      properties: [],
    } as Partial<IReactiveModelOptions<T>>
  ) {
    super();
    const defaultProps: DefaultProps[] = [
      "fetching",
      "fetched",
      "processing",
      "processed",
      "loaded",
    ];

    if (properties) {
      this.properties = properties as EntityProperty<T>[];
      this.defineReactiveProps(properties, props);
      if (Object.keys(props).length > 0) {
        this.setInitialValues(props as Partial<T>);
      }
    }

    this.defineReactiveProps(
      defaultProps as ReactiveProperty<T>[],
      this.initialValues
    );
  }

  protected setInitialValues(specs?: Partial<T>): Partial<T> {
    if (!specs) return this.#initialValues;

    const values = {} as ModelProperties<T>;

    this.properties.forEach((property) => {
      if (typeof property !== "string") {
        property = property as ReactiveObjectProperty<T>;

        values[property.name] = specs[property.name];
        return;
      }
      // Explicitly check if the value exists in the specs object
      if (specs.hasOwnProperty(property)) {
        values[property] = specs[property] as T[keyof T];
      } else {
        values[property] = undefined as unknown as T[keyof T]; // Ensure compatibility with the expected type
      }
    });
    this.#isDraft = Object.keys(specs).length === 0;

    this.#initialValues = values;

    return this.#initialValues;
  }

  getProperty<K extends keyof T>(key: K): T[K] {
    return this._reactiveProps[key]; // Type-safe access.
  }

  property = this.getProperty;

  protected defineReactiveProp<K extends keyof T>(
    propKey: string,
    initialValue: any,
    model: boolean = false
  ): void {
    this._reactiveProps[propKey] = initialValue;

    Object.defineProperty(this, propKey as string, {
      get: () => {
        return this._reactiveProps[propKey];
      },
      set: (newVal): void => {
        if (model) {
          const instance = this._reactiveProps[propKey];
          this.trigger(`${propKey}.changed`, {
            value: newVal,
            previous: instance.getProperties(),
          });
          this.trigger("change");
          this._reactiveProps[propKey].set(newVal);
          return;
        }

        if (newVal !== undefined && newVal === this._reactiveProps[propKey])
          return;

        const previous = this._reactiveProps[propKey];
        this._reactiveProps[propKey] = newVal;

        this.trigger(`${propKey}.changed`, { value: newVal, previous });
        this.trigger("change");
      },
      enumerable: true,
      configurable: true,
    });
  }

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
  protected defineReactiveProps(props: ReactiveProperty<T>[], values?): void {
    for (let propKey of props) {
      const descriptor = Object.getOwnPropertyDescriptor(
        this,
        propKey as string
      );

      if (propKey === undefined) continue;

      if (typeof propKey !== "object") {
        this.#propertyNames.add(propKey);
        let initialValue = values?.[propKey] ?? descriptor?.value;
        this.defineReactiveProp(propKey as string, initialValue);
        continue;
      }

      const data = propKey as ReactiveObjectProperty<T>;
      const name = data.name as string;
      let initialValue = values?.[name] ?? descriptor?.value;
      const specs = data.properties ?? {};

      if (typeof data.value !== "function" && typeof data.value !== "object") {
        console.warn(`Invalid value type for  ${name as string}`);
        continue;
      }

      const parameters = data.value.isCollection
        ? { parent: this }
        : { parent: this, ...initialValue, ...specs };
      const instance = new data.value(parameters);

      if (data.value.isCollection) {
        instance.setItems(initialValue);
      }

      this.#propertyNames.add(name);
      this.defineReactiveProp(name, instance, true);

      continue;
    }
  }

  protected reactiveProps(props: ReactiveProperty<T>[]) {
    this.defineReactiveProps(props);
  }

  setProperty(propKey: string, value: any) {
    this._reactiveProps[propKey] = value;
  }

  private validateProperty(propKey: string, value: any): ValidatedPropertyType {
    if (!this.schema) {
      return { valid: true, error: null };
    }

    if (!this.schema.shape[propKey]) {
      return {
        valid: false,
        error: new ZodError([
          {
            path: [propKey],
            message: `Property ${propKey} is not defined in the schema`,
            code: "custom",
          },
        ]),
      };
    }

    const propSchema = this.schema.shape[propKey] as ZodTypeAny;
    const result = propSchema.safeParse(value);

    if (!result.success) {
      return { valid: false, error: result.error };
    }

    return { valid: true, error: null };
  }
  private isSameObject = (a: any, b: any) =>
    JSON.stringify(a) === JSON.stringify(b);

  /**
   * Validates the provided properties against the model's Zod schema.
   * Only validates properties that are defined in the model's properties array.
   *
   * @param {Partial<T>} properties - The properties to validate
   * @returns {{ valid: boolean; errors: PropertyValidationErrors<T> }} An object containing:
   *   - `valid`: boolean indicating if all properties are valid
   *   - `errors`: object containing validation errors for each invalid property
   */
  validate(properties): {
    valid: boolean;
    errors: PropertyValidationErrors<T>;
  } {
    const keys = Object.keys(properties);
    const errors: PropertyValidationErrors<T> = {};
    const onValidate = (prop) => {
      if (!this.properties || !this.properties.includes(prop)) {
        console.trace(`is not a property`, prop);
        return;
      }
      const validated = this.validateProperty(prop, properties[prop]);

      if (!validated.valid) {
        errors[prop] = validated.error;
      }
    };
    keys.forEach(onValidate);

    return { valid: !!Object.keys(errors).length, errors };
  }

  set(properties: Partial<T>): SetPropertiesResult {
    if (!properties) {
      console.warn(
        "you are trying to set an empty object",
        this.constructor.name,
        properties
      );
      return {
        updated: false,
      };
    }

    const keys = Object.keys(properties);
    let updated = false;
    const errors: PropertyValidationErrors<T> = {};

    const onSet = (prop) => {
      if (!this.#propertyNames.has(prop)) {
        // console.trace(`is not a property`, prop, this.constructor.name);
        return;
      }

      const validated = this.validateProperty(prop, properties[prop]);
      if (!validated.valid) {
        errors[prop] = validated;
        return;
      }

      //@ts-ignore
      if (this.getProperty(prop)?.isReactive) {
        const instance = this.getProperty(prop) as unknown as ReactiveModel<T>;

        instance.set(properties[prop]);
        if (instance.unpublished) updated = true;

        return;
      }

      const isObject = typeof properties[prop] === "object";
      const isSameObject = isObject && this.isSameObject([prop], this[prop]);

      if (this[prop] === properties[prop] || isSameObject) return;

      this[prop] = properties[prop]!;
      updated = true;
    };

    keys.forEach(onSet);
    if (updated) {
      this.trigger("change");
      this.trigger("set.executed");
    }

    return { updated, errors };
  }

  /**
   * Gets all properties of the model, including nested reactive objects and collections.
   * For collections, it returns the item properties instead of the collection instance.
   *
   * @returns {Partial<T>} An object containing all properties of the model
   */
  getProperties(): Partial<T> {
    const props = {} as Partial<T>;

    const loop = (property) => {
      let name = property;

      if (typeof property === "object" && property.value.isReactive) {
        name = property.name;
        /**
         * If the property is a collection, we return the items.
         */
        props[String(name)] = property.value.isCollection
          ? this[name].getItemProperties()
          : this[name]?.getProperties();
        return;
      }

      props[String(name)] = this[name];
    };
    this.properties.forEach(loop);
    return props;
  }

  /**
   * Reverts all properties of the model back to their initial values.
   * This is useful for discarding changes and restoring the model to its original state.
   */
  revert() {
    this.set(this.initialValues);
  }

  /**
   * Saves the current state of the model as the new initial state.
   * This marks the model as no longer being a draft and updates the initial values
   * to match the current state. Useful after successfully persisting changes.
   */
  saveChanges() {
    this.#initialValues = this.getProperties();
    this.#isDraft = false;
  }

  /**
   * Triggers an event after a specified delay.
   * @deprecated use trigger method instead.
   * @param {string} event - The name of the event to trigger.
   * @param {Record<string, any>} params - Additional parameters for the event, including an optional `delay` property.
   */
  triggerEvent = (
    event: string = "change",
    params: Record<string, any> = {}
  ): void => {
    this.trigger(event);
  };
}

/**
 * File: types\index.ts
 */
import { ZodError } from "zod";
export /*bundle*/ type ModelProperties<T> = any;
export type PropertyValidationErrors<T> = Partial<
  Record<keyof T, ValidatedPropertyType>
>;

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

export type DefaultProps =
  | "fetching"
  | "fetched"
  | "processing"
  | "processed"
  | "loaded";
/**
 * Represents a reactive property which is another ReactiveModel instance.
 */
export type ReactiveObjectProperty<T> = {
  name: keyof T;
  value: any;
  properties: any;
};
export type ReactiveProperty<T> =
  | keyof T
  | DefaultProps
  | ReactiveObjectProperty<T>
  | string;
