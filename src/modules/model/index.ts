import { Timeout } from './interfaces/initial-values';
import { Events } from '@beyond-js/events/events';
interface IUser {
	name: string;
}

export /*bundle */ class ReactiveModel<T> extends Events {
	#reactiveProps: Record<string, any> = {}; // any reactive prop.
	get reactiveProps() {
		return this.#reactiveProps;
	}
	#properties: Record<string, any> = {};
	protected properties: (keyof T)[] = [];
	// properties of the object
	debounceTimeout: Timeout | null;
	fetching: boolean = false;
	fetched: boolean = false;
	processing: boolean = false;
	processed: boolean = false;
	loaded: boolean = false;

	constructor(props: any = {}) {
		super();
		this.defineReactiveProps(['fetching', 'fetched', 'processing', 'processed', 'loaded'], false);
		if (props.properties) {
			this.properties = props.properties;
			this.defineReactiveProps(props.properties, false);
		}
	}

	protected defineReactiveProp(propKey: string, initialValue: any): void {
		this.#reactiveProps[propKey] = initialValue;
		Object.defineProperty(this, propKey as string, {
			get: () => {
				return this.#reactiveProps[propKey];
			},
			set: (newVal): void => {
				if (newVal !== undefined && newVal === this.#reactiveProps[propKey]) return;
				this.#reactiveProps[propKey] = newVal;
				this.triggerEvent();
			},
			enumerable: true,
			configurable: true,
		});
	}

	protected defineReactiveProps(props: string[], values?): void {
		for (const propKey of props) {
			const descriptor = Object.getOwnPropertyDescriptor(this, propKey as string);
			const initialValue = values?.[propKey] ?? descriptor?.value;
			this.defineReactiveProp(propKey, initialValue);
		}
	}

	triggerEvent = (event: string = 'change', delay: number = 100): void => {
		if (this.debounceTimeout !== null) clearTimeout(this.debounceTimeout);
		this.debounceTimeout = globalThis.setTimeout(() => {
			this.trigger(event);
			this.debounceTimeout = null;
		}, delay);
	};

	isSameObject = (a: any, b: any) => JSON.stringify(a) === JSON.stringify(b);
	set(properties, batch: boolean = false) {
		const keys = Object.keys(properties);
		let updated = false;
		console.log(0.1, properties, keys);
		const onSet = prop => {
			if (!this.properties || !this.properties.includes(prop)) {
				console.log(`is not a property`, prop);
				return;
			}
			const isObject = typeof properties[prop] === 'object';
			const isSameObject = isObject && this.isSameObject(properties[prop], this[prop]);
			console.log(0.2, prop, this[prop], properties[prop], properties);
			if (this[prop] === properties[prop] || isSameObject) return;
			const descriptor = Object.getOwnPropertyDescriptor(this, prop as string);
			if (!descriptor?.set) return;

			this.#reactiveProps[prop] = properties[prop]!;
			updated = true;
		};
		keys.forEach(onSet);
	}

	getProperties() {
		const props: Record<string, any> = {};
		const properties = this.properties;
		const loop = property => {
			const name = property;
			props[String(name)] = this[name];
		};
		this.properties.forEach(loop);
		return props;
	}
}
