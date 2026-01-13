import { ReactiveModel } from "reactive/model";
import { v7 as uuidv7 } from "uuid";

interface IRegistrySpecs {
  id?: any;
  properties?: any[];
  instanceId?: any;
  parent?: any;
  register?: boolean;
  [key: string]: any;
}

export class Registry extends ReactiveModel<Registry> {
  #id: any;
  #instanceId: any;
  #isDeleted: boolean = false;

  #draft: boolean = false;

  #state: "draft" | "published" | "deleted" = "draft";
  get state() {
    return this.#state;
  }
  get draft() {
    return this.#draft;
  }
  set draft(value: boolean) {
    if (value === this.#draft) return;
    this.#draft = value;
    this.trigger("change");
  }

  get id() {
    return this.#id || this.#values.id;
  }

  get instanceId() {
    return this.#instanceId;
  }

  #values: any;
  get values() {
    return this.#values;
  }

  get deleted(): boolean {
    return this.#isDeleted;
  }

  set deleted(value: boolean) {
    if (value === this.#isDeleted) return;
    this.#isDeleted = value;

    this.trigger("record.deleted", this.#values);
    this.trigger("change");
  }
  #entity: string;

  constructor(
    entity: string,
    { properties, parent, register, ...data }: IRegistrySpecs = {}
  ) {
    super({ properties: properties || [] });

    this.#entity = entity;
    const { id } = data;
    this.#instanceId = data?.instanceId ? data.instanceId : uuidv7();

    this.#id = id;
    this.#draft = !id;
    // Loop through data and ignore reactive objects
    this.#values = Object.entries(data).reduce(
      (acc, [key, value]) => {
        if (typeof value === "object" && value?.isReactive) {
          return acc;
        }
        acc[key] = value;
        return acc;
      },
      { id: this.#id }
    );

    this.#state = this.#id ? "published" : "draft";
    this.setValues(this.#values);
  }

  setValues(data: Record<string, any>, publish = false): boolean {
    if (!data || Object.keys(data).length === 0) return false;

    const baseState = this.#state;
    let updated = false;

    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const value = data[key];
        if (value === this.#values[key]) continue;

        this.#values[key] = value;
        updated = true;
      }
    }

    if (!updated) return false;

    this.trigger("change", { values: this.#values });
    this.trigger("record.updated", { ...this.#values });

    // Solo dispara record.published si está en draft y publish = true
    if (publish && baseState === "draft") {
      this.#state = "published";
      this.trigger("record.published", { ...this.#values });
    }

    return true;
  }

  getValues() {
    return { ...this.#values };
  }
}
