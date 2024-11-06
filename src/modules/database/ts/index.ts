import Dexie from 'dexie';
import { Events } from '@beyond-js/events/events';
import { PendingPromise } from '@beyond-js/kernel/core';
import { Database } from './database';

export /*bundle */ class DatabaseManager extends Events {
	#promise;
	#ready;
	get ready() {
		return this.#ready;
	}

	#db: Dexie;
	get db() {
		return this.#db;
	}
	#databases = new Map();
	constructor() {
		super();

		const db = new Dexie('ReactiveDatabase');
		this.#db = db;
		db.version(1).stores({ schemas: 'name, table, fields' });
		db.open().then(this.#onFinished).catch(this.#onError);
	}

	#onFinished = () => {
		this.trigger('loaded.reactive.database');
		if (this.#promise) this.#promise.resolve();
	};
	#onError = err => {
		this.trigger('error');
		console.error(err);
	};

	load() {
		if (this.ready) return this.ready;
		if (this.#promise) return this.#promise;
		this.#promise = new PendingPromise();
		const onFinished = () => {
			this.#ready = true;
			this.#promise.resolve();
			this.#promise = undefined;
		};
		this.on('finished', onFinished);
		this.on('error', () => {
			this.#promise.reject();
			this.#promise = undefined;
		});
	}

	async open(identifier) {
		if (!identifier) {
			throw new Error(`Identifier ${identifier} was not defined correctly`);
		}
		let [name, version = 1] = identifier.split('@');
		if (!this.#databases.has(name)) {
			const schema = new Database(name, version);
			this.#databases.set(name, schema);
			return schema;
		}

		return this.#databases.get(name);
	}

	get = name => this.open(name);

	async config(name, stores) {
		const schema = await this.open(name);
		return schema.register(stores);
	}
}
export /* bundle */ const DBManager = new DatabaseManager();
