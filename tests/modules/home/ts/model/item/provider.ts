import { IEntityProvider } from '@beyond-js/reactive/entities/item';
import { PendingPromise } from '@beyond-js/kernel/core';

export class ItemProvider {
	async list() {
		const promise = new PendingPromise();

		setTimeout(() => {
			promise.resolve([
				{
					id: 1,
					name: 'Julio',
				},
				{
					id: 2,
					name: 'Julia',
				},
			]);
		}, 1000);
		return promise;
	}

	async getData() {
		const promise = new PendingPromise();

		setTimeout(() => {
			promise.resolve({
				id: 1,
				name: 'Julio',
			});
		}, 1000);
		return promise;
	}
}
