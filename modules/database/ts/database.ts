import Dexie from 'dexie';
import { Events } from '@beyond-js/events/events';
import { PendingPromise } from '@beyond-js/kernel/core';

export class Database extends Events {
	#version = 1;

	#db: Dexie;
	get db() {
		return this.#db;
	}
	#promise: PendingPromise<boolean>;
	#currentVersion: any;
	static #instance: Database;
	#ready: boolean;

	#name;
	get ready() {
		return this.#ready;
	}

	constructor(name, version) {
		super();

		this.#name = name;
		this.#version = version;
		this.create();
		this.#promise = new PendingPromise();

		globalThis.db = this.#db;
	}

	async create() {
		this.#db = new Dexie(this.#name);
		this.#currentVersion = this.#db.version(this.#version);
	}

	#onReady = () => {
		this.#ready = true;
		this.#promise.resolve();
		this.#promise = undefined;
	};
	#onError = (error) => {
		this.#promise.resolve();
		this.#promise = undefined;
		throw new Error(error);
	};
	#nextVersion() {
		this.#version++;
		return this.#version;
	}

	register = async (data) => {
		Object.keys(data).forEach((store) => {
			const items = data[store].split(',');
			const filter = new Set(items);
			filter.add('offline');
			filter.add('instanceId');
			data[store] = Array.from(filter).join(',');
		});

		this.#currentVersion.stores(data);

		try {
			await this.#db.open();
			return this.#db;
		} catch (e) {
			console.error('error registering', e);
		}
	};
}
