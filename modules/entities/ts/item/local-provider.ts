import { ReactiveModel } from "@beyond-js/reactive/model";
import { IProvider } from "../interfaces/provider";
import { PendingPromise } from "@beyond-js/kernel/core";
import { DBManager, DatabaseManager } from "@beyond-js/reactive/database";
import Dexie from "dexie";
export /*bundle*/ class LocalProvider extends ReactiveModel<IProvider> {
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
	#getProperty;
	constructor(parent, getProperty) {
		super();
		this.#getProperty = getProperty;
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
	init = async (id: string | number) => {
		try {
			const database: DatabaseManager = await DBManager.get(this.#databaseName);
			this.#database = database;
			this.#store = database.db[this.#storeName];

			return this.load({ id });
		} catch (e) {
			console.error(e);
		}
	};

	private handleConnection = () => {
		this.triggerEvent();
		console.log("cambio la conexión");
	};

	isUnpublished(data) {
		const properties = Object.keys(data);
		if (!this.#originalData) return true;
		return properties.some(prop => this.#originalData[prop] !== data[prop]);
	}
	async load({ id = undefined } = {}) {
		id = id ?? this.#parent.id;
		try {
			if (!id) {
				throw new Error("id is required");
			}
			const data = await this.#store.get(id);
			if (data) this.#originalData = data;
			else this.#found = false;

			if (data) this.#exists = true;
			return data;
		} catch (e) {
			console.error(e);
		}
	}

	async save(data) {
		try {
			if (!this.isUnpublished) return;
			if (!this.isOnline) data.offline = true;
			if (this.#exists) return this.#update(data);
			await this.#store.put(data);
		} catch (e) {}
	}

	async #update(data) {
		try {
			if (!this.isUnpublished) return;
			await this.#store.update(data.id, data);
		} catch (e) {}
	}
}
