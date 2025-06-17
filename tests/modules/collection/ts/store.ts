import { ReactiveModel } from "@beyond-js/reactive/model";
import { TestCollection } from "./model/collection";

export class StoreManager extends ReactiveModel<StoreManager> {
  collection: TestCollection;

  constructor() {
    super();
    this.collection = new TestCollection();
    globalThis.collection = this.collection;
  }

  /**
   * Instancia la colección y la asigna a la propiedad collection.
   * @param options Opciones para la carga, puede incluir { update: true } para paginación.
   */
  async load(options?: any) {
    await this.collection.load(options);

    this.trigger("collection.loaded", { collection: this.collection });
    return this.collection;
  }

  /**
   * Actualiza la colección usando paginación (simula update con load({ update: true }))
   */
  async update() {
    return this.load({ update: true });
  }
}
