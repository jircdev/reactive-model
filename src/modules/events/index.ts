import { EventsSpecs, ListenerFunction, ListenerSpecs, Trigger, TriggerSpecs, Inherited } from './types';

export /*bundle*/ class Events {
	#specs: EventsSpecs;
	#listeners: Map<string, ListenerSpecs[]> = new Map();
	#destroyed = false;
	get destroyed() {
		return this.#destroyed;
	}

	constructor(specs?: EventsSpecs) {
		specs = specs ? specs : {};

		if (specs.supported && !(specs.supported instanceof Array)) throw new Error('Invalid parameters');
		this.#specs = specs;

		if (specs.bind) {
			specs.bind.bind = (event: string, listener: ListenerFunction, priority: number): this =>
				this.on(event, listener, priority);
			specs.bind.unbind = (event, listener) => this.off(event, listener);
		}
	}

	/**
	 * Binds an event handler to an event name
	 *
	 * @param {string} event
	 * @param {ListenerFunction} listener
	 * @param {number} priority
	 * @returns {this}
	 */
	on(event: string, listener: ListenerFunction, priority?: number): this {
		if (this.#destroyed) {
			throw new Error('Events object is destroyed');
		}
		if (this.#specs.supported && !this.#specs.supported.includes(event)) {
			throw new Error(`Event "${event}" is not defined`);
		}
		if (typeof listener !== 'function') {
			throw new Error('Listener is not a function');
		}

		this.off(event, listener); // Just in case the listener is already registered

		const l: ListenerSpecs[] = this.#listeners.has(event) ? this.#listeners.get(event)! : [];
		this.#listeners.set(event, l);
		l.push({ listener: listener, priority: priority ? priority : 0 });

		return this;
	}

	bind = (event: string, listener: ListenerFunction, priority?: number) => this.on(event, listener, priority);

	/**
	 * Unbind an event listener
	 *
	 * @param {string} event
	 * @param {ListenerFunction} listener
	 * @param {number} force
	 * @returns {this}
	 */
	off(event: string, listener: ListenerFunction, force?: number): this {
		if (this.#destroyed) {
			throw new Error('Events object is destroyed');
		}
		if (!event) {
			throw new Error(`Event name not specified`);
		}
		if (this.#specs.supported && !this.#specs.supported.includes(event)) {
			throw new Error(`Event "${event}" is not defined`);
		}

		if (!listener) {
			if (!force) throw new Error('Listener function not set');
			this.#listeners.delete(event);
			return this;
		}

		if (!this.#listeners.has(event)) {
			return this;
		}

		const e = this.#listeners.get(event)!;
		const filtered: ListenerSpecs[] = e.filter(item => item.listener !== listener);
		this.#listeners.set(event, filtered);

		return this;
	}

	unbind = (event: string, listener: ListenerFunction, force?: number) => this.off(event, listener, force);

	/**
	 * Triggers an event
	 *
	 * @param {Trigger} event
	 * @param {*} rest
	 * @returns {Promise<*>}
	 */
	trigger(event: Trigger, ...rest: any): any {
		if (this.#destroyed) {
			throw new Error('Events object is destroyed');
		}

		if (typeof event === 'object') console.trace(event);
		const eventObj = typeof event === 'string' ? { name: event } : event;
		// console.log(0.2, event);
		if (typeof eventObj !== 'object') throw new Error('Invalid parameters');
		if (typeof eventObj.name !== 'string') throw new Error('Invalid event name');

		if (this.#specs.supported && !this.#specs.supported.includes(eventObj.name)) {
			throw new Error(`Event "${eventObj.name}" is not defined`);
		}

		let args = [...arguments];
		args.shift(); // Remove the event name from the list of arguments

		if (!this.#listeners.has(eventObj.name)) return;

		let l = this.#listeners.get(eventObj.name)!;

		// Sort by priority
		l.sort((a, b) => b.priority - a.priority);

		if (eventObj.async) {
			const trigger = async function () {
				const promises = [];
				for (let listener of l) {
					promises.push(listener.listener(...args));
				}

				await Promise.all(promises);
			};

			return trigger.call(this, ...args).catch((exc: Error) => console.error(exc.stack));
		} else {
			for (let listener of l) {
				listener.listener(...args);
			}
		}
	}

	destroy() {
		this.#destroyed = true;
		this.#listeners.clear();
	}
}

// Re-export types for external use
export type { EventsSpecs, ListenerFunction, ListenerSpecs, Trigger, TriggerSpecs, Inherited };
