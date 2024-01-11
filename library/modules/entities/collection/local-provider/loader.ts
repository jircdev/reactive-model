import { PendingPromise } from '@beyond-js/kernel/core';
import { CollectionLocalProvider } from '.';
import { Observable, liveQuery } from 'dexie';

export class LocalProviderLoader {
	#parent: CollectionLocalProvider;
	#promiseLoad: PendingPromise<any>;
	#params: { [key: string]: any };
	#listItems = new Map();
	#items = [];
	#total: number;
	#page = 0;
	#ids = new Set();
	#controls: string[] = ['or', 'and'];

	#customWhere: Function;
	#defaultWhere = store => store.orderBy('id');
	#currentLimit: number;
	#currentOffset: number;

	constructor(parent: CollectionLocalProvider, parentPrivateProps) {
		this.#parent = parent;
		this.#items = parentPrivateProps.items;
	}

	where = (params, limit) => {
		return async () => {
			let store = this.#parent.store;
			const { sortBy } = params;
			const offset = (this.#page - 1) * limit;
			const specs = { ...params };
			Object.keys(specs).forEach(key => {
				['and', 'or', 'limit', 'sortBy', 'sortDirection'].includes(key) && delete specs[key];
			});

			let collection = Object.keys(specs).length === 0 ? store : store.where(specs);

			//const filter = this.#customWhere ?? this.#defaultWhere;

			this.#currentLimit = limit;
			this.#currentOffset = offset;
			/**
			 * @todo: the isDeleted field must be set as 0 by default.
			 */

			if (sortBy) {
				await collection.sortBy(sortBy);
			}
			collection = collection.filter(i => i.isDeleted !== 1);

			return collection.offset(offset).limit(limit).toArray();
		};
	};

	customFilter = (callback: Function) => {
		this.#customWhere = callback;
		return this.#parent;
	};

	#quantity = 0;
	async load(params: { [key: string]: any }) {
		if (!this.#parent.apply) return;
		if (this.#promiseLoad) return this.#promiseLoad;
		if (JSON.stringify(this.#params) === JSON.stringify(params)) return this.#promiseLoad;

		this.#promiseLoad = new PendingPromise();
		await this.#parent.init();

		this.#processConditions(params);
		return this.#performLoad(params);
	}

	#processConditions(params: { [key: string]: any }) {
		const conditions = Object.keys(params);
		conditions.forEach(condition => {
			if (this.#controls.includes(condition)) {
				this.#processControl(condition, params[condition]);
			}
		});
	}

	#processControl(control: string, conditions: unknown) {
		this.#parent.store[control];
	}

	async #performLoad(params: { [key: string]: any }) {
		try {
			if (!this.#total) this.#total = await this.#parent.store.count();
			let limit = params.limit ?? 30;
			const totalPages = Math.ceil(this.#total / limit);
			if (totalPages < this.#page) return;
			const live = liveQuery(this.where(params, limit));
			this.#page++;

			return this.#subscribeToQuery(live, params, totalPages);
		} catch (error) {
			console.error('Error al cargar los elementos del store:', error);
			return { status: false, data: [] };
		}
	}

	async #subscribeToQuery(liveQuery: Observable<any>, params: { [key: string]: any }, totalPages: number) {
		let first = true;
		let currentPage: number;
		liveQuery.subscribe({
			next: async items => {
				const response = await this.#handleQueryResponse(items, params, totalPages, currentPage);
				first = false;
				this.#resolvePromiseLoad(response);
			},
			error: err => {
				console.error(err);
				this.#resolvePromiseLoad({ status: false, data: [] });
			},
		});
		return this.#promiseLoad;
	}

	async #handleQueryResponse(
		items: [{ [key: string]: any }],
		params: { [key: string]: any },
		totalPages: number,
		currentPage: number
	) {
		let sameQuery: boolean;
		this.#quantity++;

		if (params.sortBy) items.sort((a, b) => a[params.sortBy] - b[params.sortBy]);
		if (!globalThis.data) globalThis.data = []; // ?

		if (currentPage == this.#page) sameQuery = true;
		else currentPage = this.#page;

		if (sameQuery && items.length === this.#parent.items.length) return;

		const currentMap = new Set<string | number>();
		items.forEach(item => {
			this.#listItems.set(item.id, item);
			currentMap.add(item.id);
		});

		if (sameQuery) this.#cleanupItems(currentMap);

		this.#items = [...this.#listItems.values()];
		items.forEach(item => this.#ids.add(item.id));
		this.#parent.trigger('items.changed');

		return {
			status: true,
			data: items,
			total: this.#total,
			next: this.#page + 1 >= totalPages ? undefined : true,
		};
	}

	#cleanupItems(currentMap: Set<string | number>) {
		[...this.#listItems.keys()].forEach(id => {
			if (!currentMap.has(id)) {
				this.#listItems.delete(id);
			}
		});
	}

	#resolvePromiseLoad(response) {
		if (!this.#promiseLoad) return;
		this.#promiseLoad.resolve(response);
		this.#promiseLoad = null;
	}
}
