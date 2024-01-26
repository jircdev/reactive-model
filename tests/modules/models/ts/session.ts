import { ReactiveModel } from '@beyond-js/reactive/model';
/**
 * this class is used to test reactive model class directly
 */
export /*bundle */ class Session extends ReactiveModel<Session> {
	// properties = ['dni', 'phone'];
	constructor() {
		super({
			properties: ['name', 'age', 'dni'],
		});

		this.load();
	}
	async load() {
		this.fetching = false;
		globalThis.setTimeout(() => {
			this.fetching = true;
		}, 1000);
	}
}
