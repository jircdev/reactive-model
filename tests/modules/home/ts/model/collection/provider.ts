import { IEntityProvider } from '@beyond-js/reactive/entities/item';
import { PendingPromise } from '@beyond-js/pending-promise/main';

export class CollectionProvider {
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

	async filter(specs) {
		const promise = new PendingPromise();

		setTimeout(() => {
			promise.resolve([
				{
					id: 1,
					name: 'Julio',
				},
			]);
		}, 1000);
		return promise;
	}
}
