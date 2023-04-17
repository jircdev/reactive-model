import Dexie from "dexie";
import { ReactiveModel, reactiveProps } from "@beyond-js/reactive/model";
import { IProvider } from "../interfaces/provider";
import { LocalProvider } from "../local-provider";
import { ItemSaveManager } from "./save";
import { ItemLoadManager } from "./load";

export interface IITem {
	provider: any;
	skeleton: Array<string>;
	isUnpublished: boolean;
	save: Function;
	load: Function;
	publish: Function;
	sync: Function;
}

export /*bundle*/ abstract class Item<T> extends ReactiveModel<IITem> {
	#info = new Map();
	/**
	 * Represent the data that is stored in the local database
	 */
	#localData = new Map();
	protected localdb = true;
	protected provider: IProvider;
	protected storeName: string;
	protected db: string;
	#ignoredFields: Array<string> = [];
	#skeleton: Array<string> = [];
	protected localProvider: LocalProvider;

	get isUnpublished() {
		return this.localProvider.isUnpublished(this.getProperties());
	}
	#saveManager: ItemSaveManager;
	get skeleton() {
		return this.#skeleton;
	}

	get store() {
		return this.localProvider.store;
	}
	#loadManager: ItemLoadManager;
	constructor(id) {
		super();
		this.#saveManager = new ItemSaveManager(this);
		this.#loadManager = new ItemLoadManager(this);
		this.on("change", this.checkUnpublished);
	}

	checkUnpublished = () => {};

	protected async init(id) {
		try {
			this.localProvider = new LocalProvider(this.db, this.storeName);
			if (!id) return;

			const data = await this.localProvider.init(id);
			if (this.#skeleton && this.#skeleton.length > 0) {
				this.properties = this.#skeleton;
			}

			if (data) this.set(data, true);
		} catch (e) {
			console.error("error initializing", e);
		}
	}

	addLocalProvider(db: string, table: string) {
		if (this.localProvider) return;
	}

	set(data, init = false) {
		// If init is true, store the data in localData Map
		if (init) {
			Object.keys(data).forEach(key => {
				if (!this.properties.includes(key)) return;
				this.#localData.set(key, data[key]);
			});
		}

		// If a property is in the properties array, define it as a public property
		this.properties.forEach(property => {
			if (data.hasOwnProperty(property)) {
				this[property] = data[property];
			}
		});
	}

	getValues() {
		const values = {};
		this.skeleton.forEach(field => {
			if (this.hasOwnProperty(field)) values[field] = this[field];
		});
		return values;
	}
}
