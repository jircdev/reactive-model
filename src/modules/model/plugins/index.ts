/**
 * Plugin System for ReactiveModel
 *
 * This module provides a plugin architecture that allows extending
 * the behavior of ReactiveModel, Item, and Collection classes.
 *
 * @example
 * ```typescript
 * import { PluginManager, IReactivePlugin } from 'reactive/model';
 *
 * // Create a simple logging plugin
 * const loggingPlugin: IReactivePlugin = {
 *   name: 'logging',
 *   priority: 100,
 *
 *   onBeforeLoad: async (item, args) => {
 *     console.log('[Load] Starting:', args);
 *     return args;
 *   },
 *
 *   onAfterLoad: async (item, data) => {
 *     console.log('[Load] Completed:', data);
 *     return data;
 *   },
 *
 *   onBeforePublish: async (item, data) => {
 *     console.log('[Publish] Starting:', data);
 *     return data;
 *   },
 *
 *   onAfterPublish: async (item, data) => {
 *     console.log('[Publish] Completed:', data);
 *   }
 * };
 *
 * // Register globally
 * PluginManager.register(loggingPlugin);
 *
 * // Or register for specific entities
 * PluginManager.register(loggingPlugin, { entities: ['users', 'products'] });
 * ```
 *
 * @module plugins
 */

export { PluginManager } from './manager';
export type {
	IReactivePlugin,
	IPluginRegistrationOptions,
	IPersistencePluginConfig,
	IHookResult,
} from './types';
