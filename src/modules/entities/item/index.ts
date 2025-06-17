import { ReactiveModel, SetPropertiesResult } from "@beyond-js/reactive/model";
import { Registry } from "./registry";
import { RegistryFactory } from "./registry/factory";
import { IEntityProvider, IItem, IItemProps } from "./types";

export /*bundle*/ class Item<
  T extends IItem,
  P extends IEntityProvider = IEntityProvider
> extends ReactiveModel<T> {
  #factory: RegistryFactory<T>;

  #entity: string;
  get entity() {
    return this.#entity;
  }

  #registry: Registry;

  get __registryState() {
    return this.#registry.state;
  }
  #fetched: boolean;
  get fetched() {
    return this.#fetched;
  }

  #found: boolean = false;
  get found() {
    return this.#found;
  }
  protected _provider: P;

  get provider() {
    return this._provider;
  }
  get registry() {
    return this.#registry;
  }

  get __instanceId() {
    return this.#registry.instanceId;
  }
  #draft: boolean;
  get draft() {
    return this.#draft;
  }
  declare deleted: boolean;

  constructor({
    entity,
    provider,
    properties,
    ...args
  }: Partial<IItemProps<T, P>> = {}) {
    super({ ...args, properties });
    // if (this.constructor.name === 'Assignment')

    if (!entity) throw new Error("Entity is required");

    if (provider && typeof provider !== "function") {
      throw new Error(
        `Provider must be a class/constructor in object ${entity}`
      );
    }

    this.reactiveProps(["deleted"]);
    this.#entity = entity;

    this.onSet = this.onSet.bind(this);
    /**
     * This event is triggered when the set method is executed.
     */
    this.on("set.executed", this.onSet);

    if (provider) {
      this._provider = new provider(this);
    }

    this.#factory = RegistryFactory.getInstance(entity);

    this.initialize(args);
  }
  /**
   *
   * @param param0
   */
  protected initialize({ ...args }) {
    const registry = this.#factory.getItem(this.getProperty("id"), args);
    this.#registry = registry;

    const propertyValues = this.#registry.getValues();

    this.setInitialValues(propertyValues);
    // this.#registry.on('change', this.registryListener.bind(this));

    this.properties.forEach((property) => {
      // TODO: capability to support object type properties.
      if (typeof property === "string") {
        this.on(`${property}.changed`, () => {
          this.#registry.setValues({ [property]: this.getProperty(property) });
        });
      }
    });
  }

  set(values: any): SetPropertiesResult {
    const response = super.set(values);
    return response;
  }

  onSet() {
    this.#registry?.setValues(this.getProperties());
  }

  protected _load(args: any) {}
  // Define optional methods with a default implementation that gives a warning message
  async load(args?: any) {
    if (!this.provider || typeof this.provider.load !== "function") {
      throw new Error(
        `DataProvider is not defined or does not implement the load() method in object ${this.constructor.name}`
      );
    }

    try {
      const response = await this.provider.load(args);

      const data = response;
      if (!data) {
        this.#found = false;
        throw new Error("Provider.load() did not return an item.");
      }
      this.#found = true;
      this.#fetched = true;

      this.set(data);

      this.trigger("load", { ...this.getProperties() });
      this.trigger("change");

      return response;
    } catch (e) {
      this.#found = false;
      throw e;
    }
  }

  async publish(data?: any) {
    data = data ? data : this.getProperties();

    this.set({ ...this.getProperties(), ...data });
    this.#registry.setValues(this.getProperties, true);
    super.saveChanges();

    if (this.provider && typeof this.provider.publish === "function") {
      const updated = await this.provider.publish(data);

      if (!updated.status) {
        throw new Error("Error saving item");
      }
      this.set(updated.data);
      return updated.data;
    }
    return this.getProperties();
  }

  async delete(options?: { skipProvider?: boolean }): Promise<boolean> {
    try {
      const id = this.getProperty("id");

      this.#registry.deleted = true;
      this.trigger("change");

      if (
        !options?.skipProvider &&
        this.provider &&
        typeof this.provider.delete === "function"
      ) {
        this.processing = true;
        await this.provider.delete(id);
      }

      return true;
    } catch (e) {
      console.error(e);
      return false;
    } finally {
      this.processing = false;
    }
  }
}
