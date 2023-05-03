import Dexie from "dexie";
import { ReactiveModel, reactiveProps } from "@beyond-js/reactive/model";
import { IProvider } from "../interfaces/provider";
import { LocalProvider } from "./local-provider";
import { ItemSaveManager } from "./save";
import { ItemLoadManager } from "./load";
import { PendingPromise } from "@beyond-js/kernel/core";

export interface IITem {
	provider: any;
	skeleton: Array<string>;
	isUnpublished: boolean;
	save: Function;
	load: Function;
	publish: Function;
	unique: Array<string>;
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

	protected unique: Array<string> = [];

	get isUnpublished() {
		return this.localProvider.isUnpublished(this.getProperties());
	}
	#saveManager: ItemSaveManager;
	get skeleton() {
		return this.#skeleton;
	}

	private __get(property) {
		return this[property];
	}

	get store() {
		return this.localProvider.store;
	}

	get isOnline() {
		return this.localProvider.isOnline && !localStorage.getItem("reactive.offline");
	}

	get found() {
		return this.localProvider?.found;
	}
	#loadManager: ItemLoadManager;
	#objectReady = false;
	#ready = false;
	#promiseReady: PendingPromise<boolean>;

	constructor() {
		super();
		this.on("object.loaded", this.checkReady);
	}

	protected async init({ id }) {
		try {
			const getProperty = property => this.__get(property);

			this.localProvider = new LocalProvider(this, getProperty);
			this.#saveManager = new ItemSaveManager(this, getProperty);
			this.#loadManager = new ItemLoadManager(this, getProperty);

			if (!id) {
				this.trigger("object.loaded");
				id = "new";
			}

			await this.localProvider.init(id);
			if (this.#skeleton && this.#skeleton.length > 0) {
				this.properties = this.#skeleton;
			}
			this.#ready = true;

			this.trigger("object.loaded");
		} catch (e) {
			console.error("error initializing", e);
		}
	}

	protected checkReady = () => {
		if (this.#ready) {
			return this.#ready;
		}
		if (this.#promiseReady) return this.#promiseReady;

		this.#promiseReady = new PendingPromise();
		if (this.objectReady) this.#promiseReady.resolve(this.#objectReady);
		const onReady = () => {
			this.#objectReady = true;
			this.#promiseReady.resolve(this.#objectReady);
			this.#promiseReady = undefined;
		};
		this.on("object.loaded", onReady);
		return this.#promiseReady;
	};

	setOffline = value => this.localProvider.setOffline(value);

	addLocalProvider(db: string, table: string) {
		if (this.localProvider) return;
	}

	set(data, init = false) {
		// If init is true, store the data in localData Map
		if (init) {
			this.#localData = new Map(Object.entries(data));
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
