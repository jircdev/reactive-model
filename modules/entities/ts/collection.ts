import { ReactiveModel, reactiveProps } from "@beyond-js/reactive/model";
import type { Item, IITem } from "./item";

interface CollectionCounters {
	total?: number;
}
interface IColleciton {
	items: object[];
	item: Item<IITem>;
	counters: CollectionCounters;
}

export /*bundle*/ abstract class Collection extends ReactiveModel<IColleciton> {
	#items: Array<string | undefined> = [];

	@reactiveProps(["items", "counters", "next", "provider"])
	items!: any[];
	counters: CollectionCounters = { total: 0 };
	provider: any;
	next: number | undefined;

	/**
	 * metodo general para las consultas de tipo lista para las colecciones
	 * @param params Object filters and configuration
	 */
	async load(params: any = {}) {
		try {
			this.fetching = true;
			this.triggerEvent();

			params.start = params.start ? params.start : params.update === true && this.next ? this.next : 0;
			const response = await this.provider.list(params);

			if (!response.status) throw response.error ?? "ERROR_LIST_QUERY";

			const items = response.data.entries.map(record => {
				const item = new this.item();
				item.set(record, true);
				return item;
			});

			this.items = params.update === true ? this.items.concat(items) : items;
			this.counters.total = response.data.total ?? 0;
			this.next = response.data.next;
			this.loaded = true;
			this.fetching = false;
			this.triggerEvent();
			return response;
		} catch (exc) {
			console.error("ERROR LOAD", exc);
			this.loaded = false;
			this.fetching = false;
			this.triggerEvent();
			return { status: false, error: { message: exc } };
		}
	}
}
