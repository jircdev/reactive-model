import { PendingPromise } from '@beyond-js/kernel/core';
import { HARDCODED_ITEMS } from './data';

export class CollectionService {
	load() {
		const promise = new PendingPromise();
		globalThis.setTimeout(() => {
			return HARDCODED_ITEMS;
		}, 1000);
		return promise;
	}
}
