import { ReactiveModel, reactiveProps } from "@beyond-js/reactive/model";
import type { Item, IITem } from "../item";
import { CollectionLocalProvider } from "./local-provider";
import { CollectionSaveManager } from "./publish";
import { CollectionLoadManager } from "./load";

interface IColleciton {
  items: object[];
  item: Item<IITem>;
  next: number | undefined;
  provider: object;
}

interface ISpecs {}
interface ICollectionProvider {
  load: Function;
  publish: Function;
  delete: Function;
}

export /*bundle */ abstract class Collection extends ReactiveModel<IColleciton> {
  #items: Array<string | undefined> = [];

  get items() {
    return this.#items;
  }

  counters: any = {};
  /**
   * Represents the number of elements in the collection
   */
  #total: number = 0;
  get total() {
    return this.#total;
  }
  provider: any;
  next: number | undefined;

  #localProvider: CollectionLocalProvider;
  get localProvider() {
    return this.#localProvider;
  }

  #saveManager: CollectionSaveManager;
  #loadManager: CollectionLoadManager;
  #provider: ICollectionProvider;
  #initSpecs: ISpecs = {};

  constructor() {
    super();
    this.reactiveProps<IColleciton>(["item", "next", "provider"]);
  }

  protected setItems(values) {
    this.#items = values;
  }
  protected async init(specs: ISpecs = {}) {
    this.#initSpecs = specs;
    const getProperty = property => this[property];
    const setProperty = (property, value) => (this[property] = value);
    const bridge = { get: getProperty, set: setProperty };
    this.#localProvider = new CollectionLocalProvider(this, bridge);
    this.#localProvider.on("items.changed", this.#listenItems);
    this.localProvider.init();
    this.#saveManager = new CollectionSaveManager(this, bridge);
    this.#loadManager = new CollectionLoadManager(this, bridge);
  }

  #listenItems = () => {
    this.#items = this.#localProvider.items;
    this.trigger("change");
  };

  setOffline = value => this.localProvider.setOffline(value);
}
