import { PendingPromise } from "@beyond-js/kernel/core";
import { ReactiveModel } from "@beyond-js/reactive/model";
import { DBManager, DatabaseManager } from "@beyond-js/reactive/database";

interface IRegistry {
  values: object;
  id: string;
}
export class Registry extends ReactiveModel<IRegistry> {
  #values: any = {};
  get values() {
    return this.#values;
  }
  #id;
  local = false;
  #store;
  #isNew;
  #instanceId;
  #keyId;

  #landed;
  get landed() {
    return this.#landed;
  }

  get instanceId() {
    return this.#instanceId;
  }
  constructor(store, data) {
    super();
    const { id } = data;
    this.#store = store;
    this.#instanceId = Registry.generateUUID();

    this.#id = id === "new" ? undefined : id;
    this.#isNew = id === "new";
    this.#keyId = this.isNew ? "#instanceId" : "#id";
    if (this.#id) this.#values.id = id;
  }

  #promise;
  async get() {
    if (this.#promise) {
      return this.#promise;
    }

    this.#promise = new PendingPromise();

    if (this.#isNew) {
      this.#promise.resolve(this);
      this.#promise = undefined;
    } else {
      this.#store.get(this.#id).then(item => {
        if (!item) {
          this.#promise.resolve(false);
          this.#landed = false;

          this.#setValues({ id: this.#id });
          this.#promise = undefined;
          return;
        }

        this.#landed = true;
        this.#setValues(item);
        this.#promise.resolve(this);
        this.#promise = undefined;
      });
    }

    return this.#promise;
  }

  #setValues = async (data, backend = false) => {
    const props = Object.keys(data);
    let updated = false;
    // specify if the item was generated locally
    if (backend) {
      this.#isNew = false;
      this.#instanceId = undefined;
      delete this.#values.instanceId;
    }
    if (!data.id) {
      data.id = this.#id;
    }
    this.local = this.local;
    if (this.#isNew) {
      this.#values.instanceId = this.#instanceId;
    }

    props.forEach(property => {
      if (data[property] === this.#values[property]) return;
      this.#values[property] = data[property];
      updated = true;
    });
    return updated;
  };

  static generateUUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0,
        v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
  update = async (data, backend) => {
    const updated = this.#setValues(data, backend);

    if (updated) {
      await this.#store.put(this.#values);
      this.trigger("change");
    }
  };
}
