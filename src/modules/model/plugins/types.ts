/**
 * Plugin System Types for ReactiveModel
 *
 * This module defines the interfaces for creating plugins that can intercept
 * and extend the behavior of ReactiveModel, Item, and Collection classes.
 *
 * Plugins can be used to add functionality like:
 * - Local storage persistence (IndexedDB, localStorage)
 * - Caching strategies
 * - Real-time synchronization
 * - Logging and analytics
 * - Data transformation
 */

import type { ReactiveModel, SetPropertiesResult } from '../index';

/**
 * Base interface for reactive plugins.
 * Plugins can intercept lifecycle operations on ReactiveModel, Item, and Collection.
 *
 * @template T - The type of data the plugin handles
 *
 * @example
 * ```typescript
 * const loggingPlugin: IReactivePlugin = {
 *   name: 'logging',
 *   onBeforeLoad: async (item, args) => {
 *     console.log('Loading item:', args);
 *     return args;
 *   },
 *   onAfterLoad: async (item, data) => {
 *     console.log('Loaded data:', data);
 *     return data;
 *   }
 * };
 * ```
 */
export /*bundle*/ interface IReactivePlugin<T = unknown> {
	/** Unique name identifier for the plugin */
	name: string;

	/** Priority for execution order (higher = runs first). Default: 0 */
	priority?: number;

	// ==========================================
	// ReactiveModel Hooks
	// ==========================================

	/**
	 * Called before set() on any ReactiveModel.
	 * Can modify the properties before they are applied.
	 */
	onBeforeSet?(
		model: ReactiveModel<T>,
		properties: Partial<T>
	): Promise<Partial<T>> | Partial<T>;

	/**
	 * Called after set() on any ReactiveModel.
	 */
	onAfterSet?(
		model: ReactiveModel<T>,
		properties: Partial<T>,
		result: SetPropertiesResult
	): Promise<void> | void;

	// ==========================================
	// Item Hooks
	// ==========================================

	/**
	 * Called before Item.load() executes.
	 * Can modify the load arguments.
	 */
	onBeforeLoad?(item: unknown, args: unknown): Promise<unknown> | unknown;

	/**
	 * Called after Item.load() completes.
	 * Can transform the loaded data.
	 */
	onAfterLoad?(item: unknown, data: T): Promise<T> | T;

	/**
	 * Called before Item.publish() executes.
	 * Can modify the data before saving.
	 */
	onBeforePublish?(item: unknown, data: Partial<T>): Promise<Partial<T>> | Partial<T>;

	/**
	 * Called after Item.publish() completes.
	 */
	onAfterPublish?(item: unknown, data: T): Promise<void> | void;

	/**
	 * Called before Item.delete() executes.
	 * Return false to cancel deletion.
	 */
	onBeforeDelete?(item: unknown, id: string | number): Promise<boolean> | boolean;

	/**
	 * Called after Item.delete() completes.
	 */
	onAfterDelete?(item: unknown, id: string | number): Promise<void> | void;

	// ==========================================
	// Collection Hooks
	// ==========================================

	/**
	 * Called before Collection.load() executes.
	 * Can modify the load specs.
	 */
	onBeforeList?(collection: unknown, specs: unknown): Promise<unknown> | unknown;

	/**
	 * Called after Collection.load() completes.
	 * Can transform the loaded items.
	 */
	onAfterList?(collection: unknown, items: T[]): Promise<T[]> | T[];

	// ==========================================
	// Plugin Lifecycle
	// ==========================================

	/**
	 * Called when the plugin is installed on a model.
	 */
	install?(target: ReactiveModel<T>): void;

	/**
	 * Called when the plugin is uninstalled from a model.
	 */
	uninstall?(target: ReactiveModel<T>): void;
}

/**
 * Options for registering a plugin.
 */
export interface IPluginRegistrationOptions {
	/** Apply plugin only to specific entity types */
	entities?: string[];
	/** Apply plugin globally to all models */
	global?: boolean;
}

/**
 * Configuration for a persistence plugin (IndexedDB, localStorage, etc.)
 */
export /*bundle*/ interface IPersistencePluginConfig {
	/** Name of the database/store */
	database: string;
	/** Name of the object store */
	store: string;
	/** Caching strategy */
	strategy: 'cache-first' | 'network-first' | 'stale-while-revalidate' | 'cache-only' | 'network-only';
	/** Time-to-live for cached data in milliseconds */
	ttl?: number;
	/** Whether to sync with backend when online */
	syncOnReconnect?: boolean;
}

/**
 * Result of running a hook through multiple plugins.
 */
export interface IHookResult<T> {
	/** The final value after all plugins processed it */
	value: T;
	/** Whether any plugin requested to cancel the operation */
	cancelled: boolean;
	/** Errors from plugins (non-fatal) */
	errors: Error[];
}
