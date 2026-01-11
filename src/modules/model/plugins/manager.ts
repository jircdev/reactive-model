/**
 * Plugin Manager for ReactiveModel
 *
 * Manages the registration and execution of plugins across all reactive models.
 * Plugins are executed in priority order (higher priority = runs first).
 */

import { IReactivePlugin, IPluginRegistrationOptions, IHookResult } from './types';

/**
 * Manages plugins for the ReactiveModel system.
 * Provides methods to register, unregister, and execute plugin hooks.
 *
 * @example
 * ```typescript
 * // Register a plugin globally
 * PluginManager.register({
 *   name: 'logging',
 *   priority: 100,
 *   onBeforeLoad: async (item, args) => {
 *     console.log('Loading:', args);
 *     return args;
 *   }
 * });
 *
 * // Register for specific entities
 * PluginManager.register(myPlugin, { entities: ['users', 'products'] });
 *
 * // Unregister
 * PluginManager.unregister('logging');
 * ```
 */
export /*bundle*/ class PluginManager {
	/** Global plugins applied to all models */
	static #globalPlugins: Map<string, IReactivePlugin> = new Map();

	/** Entity-specific plugins */
	static #entityPlugins: Map<string, Map<string, IReactivePlugin>> = new Map();

	/**
	 * Registers a plugin.
	 *
	 * @param plugin - The plugin to register
	 * @param options - Registration options
	 */
	static register(
		plugin: IReactivePlugin,
		options: IPluginRegistrationOptions = { global: true }
	): void {
		if (!plugin.name) {
			throw new Error('Plugin must have a name');
		}

		if (options.entities && options.entities.length > 0) {
			// Register for specific entities
			for (const entity of options.entities) {
				if (!this.#entityPlugins.has(entity)) {
					this.#entityPlugins.set(entity, new Map());
				}
				this.#entityPlugins.get(entity)!.set(plugin.name, plugin);
			}
		} else {
			// Register globally
			this.#globalPlugins.set(plugin.name, plugin);
		}
	}

	/**
	 * Unregisters a plugin by name.
	 *
	 * @param name - Name of the plugin to unregister
	 * @param entity - Optional entity to unregister from (if not provided, unregisters globally)
	 */
	static unregister(name: string, entity?: string): void {
		if (entity) {
			this.#entityPlugins.get(entity)?.delete(name);
		} else {
			this.#globalPlugins.delete(name);
			// Also remove from all entities
			for (const entityPlugins of this.#entityPlugins.values()) {
				entityPlugins.delete(name);
			}
		}
	}

	/**
	 * Gets all plugins applicable to an entity.
	 *
	 * @param entity - Optional entity name to get plugins for
	 * @returns Array of plugins sorted by priority (highest first)
	 */
	static getPlugins(entity?: string): IReactivePlugin[] {
		const plugins: IReactivePlugin[] = [...this.#globalPlugins.values()];

		if (entity && this.#entityPlugins.has(entity)) {
			plugins.push(...this.#entityPlugins.get(entity)!.values());
		}

		// Sort by priority (higher first)
		return plugins.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
	}

	/**
	 * Checks if a plugin is registered.
	 *
	 * @param name - Name of the plugin
	 * @param entity - Optional entity to check
	 */
	static hasPlugin(name: string, entity?: string): boolean {
		if (this.#globalPlugins.has(name)) return true;
		if (entity && this.#entityPlugins.get(entity)?.has(name)) return true;
		return false;
	}

	/**
	 * Clears all registered plugins.
	 * Useful for testing.
	 */
	static clear(): void {
		this.#globalPlugins.clear();
		this.#entityPlugins.clear();
	}

	/**
	 * Runs a hook through all applicable plugins.
	 * Plugins are executed in priority order.
	 * Each plugin can transform the value, which is passed to the next plugin.
	 *
	 * @param hookName - Name of the hook to run
	 * @param target - The model/item/collection the hook is running on
	 * @param value - The initial value to pass through plugins
	 * @param entity - Optional entity name to include entity-specific plugins
	 * @returns The final value after all plugins have processed it
	 *
	 * @example
	 * ```typescript
	 * const modifiedArgs = await PluginManager.runHook(
	 *   'onBeforeLoad',
	 *   itemInstance,
	 *   loadArgs,
	 *   'users'
	 * );
	 * ```
	 */
	static async runHook<T>(
		hookName: keyof IReactivePlugin,
		target: unknown,
		value: T,
		entity?: string
	): Promise<IHookResult<T>> {
		const plugins = this.getPlugins(entity);
		const errors: Error[] = [];
		let currentValue = value;
		let cancelled = false;

		for (const plugin of plugins) {
			const hook = plugin[hookName];
			if (typeof hook !== 'function') continue;

			try {
				const result = await (hook as (target: unknown, value: T) => Promise<T> | T)(
					target,
					currentValue
				);

				// Handle cancellation for delete hooks
				if (hookName === 'onBeforeDelete' && result === false) {
					cancelled = true;
					break;
				}

				// Update value if result is provided
				if (result !== undefined && result !== null) {
					currentValue = result as T;
				}
			} catch (error) {
				errors.push(error as Error);
				console.error(`Plugin "${plugin.name}" error in ${String(hookName)}:`, error);
			}
		}

		return { value: currentValue, cancelled, errors };
	}

	/**
	 * Runs a hook synchronously through all applicable plugins.
	 * Use this only when you know all plugins implement the hook synchronously.
	 *
	 * @param hookName - Name of the hook to run
	 * @param target - The model/item/collection the hook is running on
	 * @param value - The initial value to pass through plugins
	 * @param entity - Optional entity name to include entity-specific plugins
	 * @returns The final value after all plugins have processed it
	 */
	static runHookSync<T>(
		hookName: keyof IReactivePlugin,
		target: unknown,
		value: T,
		entity?: string
	): T {
		const plugins = this.getPlugins(entity);
		let currentValue = value;

		for (const plugin of plugins) {
			const hook = plugin[hookName];
			if (typeof hook !== 'function') continue;

			try {
				const result = (hook as (target: unknown, value: T) => T)(target, currentValue);

				if (result !== undefined && result !== null) {
					currentValue = result as T;
				}
			} catch (error) {
				console.error(`Plugin "${plugin.name}" error in ${String(hookName)}:`, error);
			}
		}

		return currentValue;
	}

	/**
	 * Runs a void hook (like afterPublish) through all applicable plugins.
	 * Does not expect a return value.
	 *
	 * @param hookName - Name of the hook to run
	 * @param target - The model/item/collection the hook is running on
	 * @param args - Arguments to pass to the hook
	 * @param entity - Optional entity name to include entity-specific plugins
	 */
	static async runVoidHook(
		hookName: keyof IReactivePlugin,
		target: unknown,
		args: unknown[],
		entity?: string
	): Promise<void> {
		const plugins = this.getPlugins(entity);

		for (const plugin of plugins) {
			const hook = plugin[hookName];
			if (typeof hook !== 'function') continue;

			try {
				await (hook as (...args: unknown[]) => Promise<void> | void)(target, ...args);
			} catch (error) {
				console.error(`Plugin "${plugin.name}" error in ${String(hookName)}:`, error);
			}
		}
	}
}
