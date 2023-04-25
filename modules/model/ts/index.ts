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

interface IProps {
	fetching: boolean;
	fetched: boolean;
	processing: boolean;
	processed: boolean;
	loaded: boolean;
	ready: boolean;
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
abstract class ReactiveModel<T> extends Events {
	protected schema: unknown;
	[key: string]: any;

	@reactiveProps<IProps>(["fetching", "fetched", "processing", "processed", "loaded", "ready"])
	fetching!: boolean;
	fetched: boolean = false;
	processing: boolean = false;
	ready: boolean = false;
	processed: boolean = false;
	protected localdb = false;
	protected properties: string[];
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
	set(property: Partial<ReactiveModelPublic<T>>, value: any | undefined = undefined): void {
		let props: Partial<ReactiveModelPublic<T>> = {};

		let updated = false;

		for (const prop in props) {
			if (!Object.prototype.hasOwnProperty.call(this, prop)) continue;
			if (this[prop] === props[prop]) continue;
			this[prop] = props[prop];
			updated = true;
		}

		if (updated) this.triggerEvent();
	}

	getProperties(): Record<string, any> {
		const props: Record<string, any> = {};
		const properties = this.properties || this.skeleton;
		properties.forEach(property => {
			props[property] = this[property];
		});
		return props;
	}
}
