export class A {
	private events: { [key: string]: Function[] } = {};

	on(event: string, listener: Function) {
		if (!this.events[event]) {
			this.events[event] = [];
		}
		this.events[event].push(listener);
	}

	emit(event: string, data?: any) {
		if (this.events[event]) {
			this.events[event].forEach(listener => listener(data));
		}
	}

	protected defineReactiveProps<T extends object>(obj: T): T {
		const handler: ProxyHandler<T> = {
			set: (target: T, property: string | symbol, value: any): boolean => {
				const propKey = property as keyof T;
				if (target[propKey] !== value) {
					target[propKey] = value;
					this.emit(`propertyChanged:${String(property)}`, value);
				}
				return true;
			},
			get: (target: T, property: string | symbol): any => {
				return target[property as keyof T];
			},
		};

		const proxy = new Proxy(obj, handler);

		for (const key of Object.keys(obj) as (keyof T)[]) {
			Object.defineProperty(this, key, {
				get: () => proxy[key],
				set: (value: T[keyof T]) => {
					proxy[key] = value;
				},
				enumerable: true,
				configurable: true,
			});
		}

		return proxy;
	}
}
