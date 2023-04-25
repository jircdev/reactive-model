import { ReactiveModel } from "@beyond-js/reactive/model";
import { IProvider } from "../interfaces/provider";

import { DBManager, DatabaseManager } from "@beyond-js/reactive/database";
import Dexie from "dexie";
export /*bundle*/ class CollectionLocalProvider extends ReactiveModel<IProvider> {
	#isOnline = globalThis.navigator.onLine;
	#store!: Dexie.Table<any, any>;
	get store() {
		return this.#store;
	}
	#offline: boolean;
	#database!: DatabaseManager;
	#storeName!: string;
	#databaseName!: string;
	#originalData: {};
	#exists = false;
	#found = false;

	get originalData() {
		return this.#originalData;
	}
	#db: Dexie;
	get isOnline() {
		return this.#isOnline && !this.#offline && !localStorage.getItem("reactive.offline");
	}
	#parent;
	constructor(parent, bridge) {
		super();
		const { db, storeName } = parent;
		this.#parent = parent;
		if (!db || !storeName) throw new Error("database and store are required");
		this.#databaseName = db;
		this.#storeName = storeName;

		globalThis.addEventListener("online", this.handleConnection);
		globalThis.addEventListener("offline", this.handleConnection);
	}

	setOffline(value) {
		this.#offline = value;
		this.triggerEvent();
	}
	init = async () => {
		try {
			const database: DatabaseManager = await DBManager.get(this.#databaseName);
			this.#database = database;
			this.#store = database.db[this.#storeName];
		} catch (e) {
			console.error(e);
		}
	};

	private handleConnection = () => {
		this.triggerEvent();
	};

	/**
	 * @todo: Must validated if some item in the collection is not sync.
	 * @param data
	 * @returns
	 */
	#isUnpublished(data) {}

	async load(params) {
		const conditions = Object.keys(params);
		const controls = ["and", "or"];
		conditions.forEach(condition => {
			if (controls.includes(condition)) {
				this.#processControl(condition, params[condition]);
			}
		});
	}

	save(data) {
		if (!this.isOnline) data = data.forEach(item => ({ ...item, offline: true }));

		return this.#store.bulkPut(data);
	}
	#processControl(control, conditions) {
		this.#store[control];
	}
}
