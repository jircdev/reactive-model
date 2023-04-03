import { Events } from "@beyond-js/events/events";
import { reactiveProps } from "./property";

interface ReactiveModelPublic<T> {
	ready: boolean | undefined;
	fetching: boolean | undefined;
	fetched: boolean;
	processing: boolean;
	processed: boolean;
	loaded: boolean;
	[key: string]: any;
}

/**
 * The `ReactiveModel` class is a subclass of the `Events` class that provides a simple way to create
 * reactive properties that can trigger events when they change. It also provides methods for setting
 * and getting property values.
 *
 * @template T - The type of the properties that can be defined in the model.
 * @extends Events
 */
export /*bundle*/
class ReactiveModel<T> extends Events {
	protected schema: unknown;
	[key: string]: any;

	@reactiveProps(["fetching", "fetched", "processing", "processed", "loaded", "ready"])
	fetching!: boolean;
	fetched: boolean = false;
	processing: boolean = false;
	ready: boolean = false;
	processed: boolean = false;
	loaded: boolean = false;

	/**
	 * The `triggerEvent` method triggers a change event on the model, which can be used to notify
	 * subscribers of changes to the model's properties.
	 *
	 * @param {string} event - The name of the event to trigger.
	 * @returns {void}
	 */
	triggerEvent = (event: string = "change"): void => this.trigger(event);
	/**
	 * The `set` method sets one or more properties on the model.
	 *
	 * @param {keyof ReactiveModelPublic<T>} property - The name of the property to set.
	 * @param {*} value - The value to set the property to.
	 * @returns {void}
	 */
	set(property: keyof ReactiveModelPublic<T>, value: any): void {
		let props: Partial<ReactiveModelPublic<T>> = {};
		if (property && value !== undefined) {
			props[property] = value;
		} else if (typeof property === "object" && property !== null) {
			props = property;
		}
		let updated = false;

		for (const prop in props) {
			const key = `#${prop}`;
			if (!Object.prototype.hasOwnProperty.call(this, key)) continue;

			if (this[key] === props[prop]) continue;
			this[key] = props[prop];
			updated = true;
		}

		if (updated) this.triggerEvent();
	}

	/**
	 * The `set` method sets one or more properties on the model.
	 *
	 * @param {keyof ReactiveModelPublic<T>} property - The name of the property to set.
	 * @param {*} value - The value to set the property to.
	 * @returns {void}
	 */

	getProperties(): Record<string, any> {
		const props: Record<string, any> = {};
		Object.keys(this).forEach(property => {
			if (property.startsWith("#")) {
				props[property.replace("#", "")] = this[property];
			}
		});
		return props;
	}
}

