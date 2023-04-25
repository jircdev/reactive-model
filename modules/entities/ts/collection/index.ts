import { ReactiveModel, reactiveProps } from "@beyond-js/reactive/model";
import type { Item, IITem } from "../item";
import { CollectionLocalProvider } from "./local-provider";
import { CollectionSaveManager } from "./publish";
import { CollectionLoadManager } from "./load";

interface IColleciton {
	items: object[];
	item: Item<IITem>;
	counters: CollectionCounters;
}

interface ISpecs {}
interface ICollectionProvider {
	load: Function;
	publish: Function;
	delete: Function;
}

export /*bundle*/ abstract class Collection extends ReactiveModel<IColleciton> {
	#items: Array<string | undefined> = [];

	@reactiveProps(["items", "counters", "next", "provider"])
	items!: any[];
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

	protected async init(specs: ISpecs) {
		this.#initSpecs = specs;
		const getProperty = property => this[property];
		const setProperty = (property, value) => (this[property] = value);
		const bridge = { get: getProperty, set: setProperty };
		this.#localProvider = new CollectionLocalProvider(this, bridge);
		this.localProvider.init();
		this.#saveManager = new CollectionSaveManager(this, bridge);
		this.#loadManager = new CollectionLoadManager(this, bridge);
	}
}
