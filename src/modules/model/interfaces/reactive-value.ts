/**
 * Core interface for all reactive values in the system.
 * Any class that holds reactive state should implement this interface.
 *
 * @template T - The type of value this reactive holds
 */
export /*bundle*/ interface IReactiveValue<T = unknown> {
	/**
	 * Identifies this as a reactive value.
	 * Used for runtime type checking without instanceof.
	 */
	readonly isReactive: true;

	/**
	 * Sets the value(s) of this reactive.
	 * For models, this accepts partial updates.
	 * For containers, this replaces the content.
	 *
	 * @param value - The value to set
	 */
	setValue(value: T): void;

	/**
	 * Gets the current value of this reactive.
	 * For models, returns all properties.
	 * For containers, returns the items/entries.
	 */
	getValue(): T;

	/**
	 * Serializes the reactive value for JSON output or persistence.
	 * Should return a plain object/array suitable for JSON.stringify.
	 */
	serialize(): unknown;

	/**
	 * Checks if this reactive has changes that haven't been persisted.
	 * Useful for dirty checking and save prompts.
	 */
	hasUnpublishedChanges(): boolean;

	/**
	 * Registers an event listener.
	 * @param event - Event name to listen for
	 * @param handler - Callback function
	 */
	on(event: string, handler: (...args: unknown[]) => void): this;

	/**
	 * Removes an event listener.
	 * @param event - Event name
	 * @param handler - Callback function to remove
	 */
	off(event: string, handler: (...args: unknown[]) => void): this;

	/**
	 * Emits an event to all registered listeners.
	 * @param event - Event name to trigger
	 * @param data - Optional data to pass to handlers
	 */
	trigger(event: string, data?: unknown): void;
}

/**
 * Type guard to check if a value implements IReactiveValue.
 */
export /*bundle*/ function isReactiveValue(value: unknown): value is IReactiveValue {
	return (
		value !== null &&
		typeof value === 'object' &&
		'isReactive' in value &&
		(value as IReactiveValue).isReactive === true
	);
}
