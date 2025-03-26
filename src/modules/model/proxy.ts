import { Events } from '@beyond-js/events/events';

export class ProxyBase<T> extends Events {
	constructor() {
		super();

		const proxy = new Proxy(this, {
			get: (target, prop, receiver) => {
				if (prop in target) {
					const value = target[prop];
					return typeof value === 'function' ? value.bind(target) : value;
				}

				if (prop in target) {
					return Reflect.get(target, prop, receiver);
				} else {
					throw new Error(`Property ${String(prop)} does not exist`);
				}
			},
			set: (target, prop, value) => {
				target[prop] = value;
				return true;
			}
		});

		return Object.assign(this, proxy); // Ensures proxy functionality
	}
}
