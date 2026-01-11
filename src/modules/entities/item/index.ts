import { ReactiveModel, SetPropertiesResult, PluginManager, IReactiveValue } from '@beyond-js/reactive/model';
import { Registry } from './registry';
import { RegistryFactory } from './registry/factory';
import { IEntityProvider, IItem, IItemProps, ItemId } from './types';

// Re-export types and classes for external use
export type { IItem, IItemProps, IEntityProvider, ItemId };
export { RegistryFactory };

/**
 * Item class for managing individual domain entities.
 * Implements IReactiveValue for unified reactive value handling.
 *
 * @template T - The entity type (must extend IItem)
 * @template P - The provider type
 */
export /*bundle*/ class Item<T extends IItem, P extends IEntityProvider = IEntityProvider>
	extends ReactiveModel<T>
	implements IReactiveValue<Partial<T>>
{
	#factory: RegistryFactory<T>;

	#entity: string;
	get entity() {
		return this.#entity;
	}

	#registry: Registry;

	get __registryState() {
		return this.#registry.state;
	}
	#fetched: boolean = false;
	get fetched() {
		return this.#fetched;
	}

	#found: boolean = false;
	get found() {
		return this.#found;
	}
	protected _provider: P;

	get provider() {
		return this._provider;
	}
	get registry() {
		return this.#registry;
	}

	get __instanceId() {
		return this.#registry.instanceId;
	}
	#draft: boolean;
	get draft() {
		return this.#draft;
	}
	declare deleted: boolean;

	// Tracking changed properties for partial updates
	#changedProperties: Set<keyof T> = new Set();

	/**
	 * Returns the list of properties that have been modified since the last publish.
	 */
	get changedProperties(): (keyof T)[] {
		return [...this.#changedProperties];
	}

	/**
	 * Returns only the properties that have changed since the last publish.
	 * Useful for partial updates to avoid sending unchanged data.
	 */
	getChangedValues(): Partial<T> {
		const changed: Partial<T> = {};
		for (const prop of this.#changedProperties) {
			changed[prop] = this.getProperty(prop);
		}
		// Always include id for identification
		if (this.getProperty('id' as keyof T)) {
			(changed as Record<string, unknown>)['id'] = this.getProperty('id' as keyof T);
		}
		return changed;
	}

	/**
	 * Clears the tracked changed properties.
	 * Called automatically after successful publish.
	 */
	clearChangedProperties(): void {
		this.#changedProperties.clear();
	}

	constructor({ entity, provider, properties, ...args }: Partial<IItemProps<T, P>> = {}) {
		super({ properties, ...args } as any);

		if (!entity) throw new Error('Entity is required');

		if (provider && typeof provider !== 'function') {
			throw new Error(`Provider must be a class/constructor in object ${entity}`);
		}

		this.reactiveProps(['deleted']);
		this.#entity = entity;

		this.onSet = this.onSet.bind(this);
		/**
		 * This event is triggered when the set method is executed.
		 */
		this.on('set.executed', this.onSet);

		if (provider) {
			this._provider = new provider(this);
		}

		this.#factory = RegistryFactory.getInstance(entity);

		this.initialize(args);
	}
	/**
	 *
	 * @param param0
	 */
	protected initialize({ ...args }) {
		const registry = this.#factory.getItem(this.getProperty('id'), args);
		this.#registry = registry;

		const propertyValues = this.#registry.getValues();

		this.setInitialValues(propertyValues);
		// this.#registry.on('change', this.registryListener.bind(this));

		this.properties.forEach(property => {
			// TODO: capability to support object type properties.
			if (typeof property === 'string') {
				this.on(`${property}.changed`, () => {
					this.#registry.setValues({ [property]: this.getProperty(property) });
				});
			}
		});
	}

	set(values: Partial<T>): SetPropertiesResult {
		// Track which properties are being changed
		if (values) {
			for (const key of Object.keys(values)) {
				this.#changedProperties.add(key as keyof T);
			}
		}
		const response = super.set(values);
		return response;
	}

	// ==========================================
	// IReactiveValue Implementation (explicit overrides)
	// ==========================================

	/**
	 * Serializes the item to a plain object for JSON output.
	 * Returns the item's properties without the Item instance wrapper.
	 */
	serialize(): Partial<T> {
		return this.getProperties();
	}

	onSet() {
		this.#registry?.setValues(this.getProperties());
	}

	// ==========================================
	// LIFECYCLE HOOKS - Override in subclasses
	// ==========================================

	/**
	 * Lifecycle hook called before load() executes.
	 * Override to modify load arguments or perform pre-load actions.
	 *
	 * @param args - Arguments to be passed to provider.load()
	 * @returns Modified arguments or original args
	 */
	protected async beforeLoad(args: unknown): Promise<unknown> {
		return args;
	}

	/**
	 * Lifecycle hook called after load() completes successfully.
	 * Override to transform loaded data or perform post-load actions.
	 *
	 * @param data - Data returned from provider.load()
	 * @returns Modified data or original data
	 */
	protected async afterLoad(data: T): Promise<T> {
		return data;
	}

	/**
	 * Lifecycle hook called before publish() executes.
	 * Override to modify data before saving or perform validation.
	 *
	 * @param data - Data to be published
	 * @returns Modified data or original data
	 */
	protected async beforePublish(data: Partial<T>): Promise<Partial<T>> {
		return data;
	}

	/**
	 * Lifecycle hook called after publish() completes successfully.
	 * Override to perform post-save actions.
	 *
	 * @param data - Data that was saved
	 */
	protected async afterPublish(data: T): Promise<void> {
		// Default implementation does nothing
	}

	/**
	 * Lifecycle hook called before delete() executes.
	 * Override to perform validation or cleanup before deletion.
	 * Return false to cancel the deletion.
	 *
	 * @param id - ID of the item being deleted
	 * @returns true to proceed with deletion, false to cancel
	 */
	protected async beforeDelete(id: ItemId): Promise<boolean> {
		return true;
	}

	/**
	 * Lifecycle hook called after delete() completes successfully.
	 * Override to perform post-deletion cleanup.
	 *
	 * @param id - ID of the deleted item
	 */
	protected async afterDelete(id: ItemId): Promise<void> {
		// Default implementation does nothing
	}

	// ==========================================
	// CRUD OPERATIONS WITH LIFECYCLE HOOKS
	// ==========================================

	protected _load(args: unknown) {}

	/**
	 * Loads the item from the provider.
	 * Executes lifecycle hooks: beforeLoad -> load -> afterLoad
	 * Runs plugins: onBeforeLoad -> onAfterLoad
	 * Emits events: pre:load -> load -> post:load
	 */
	async load(args?: unknown): Promise<T> {
		if (!this.provider || typeof this.provider.load !== 'function') {
			throw new Error(
				`DataProvider is not defined or does not implement the load() method in object ${this.constructor.name}`
			);
		}

		this.fetching = true;
		try {
			// 1. Execute beforeLoad hook (class method)
			let loadArgs = await this.beforeLoad(args);

			// 2. Execute plugins beforeLoad
			const pluginResult = await PluginManager.runHook('onBeforeLoad', this, loadArgs, this.#entity);
			loadArgs = pluginResult.value;

			// 3. Emit pre:load event
			this.trigger('pre:load', loadArgs);

			// 4. Execute provider load
			const response = await this.provider.load(loadArgs);

			if (!response) {
				this.#found = false;
				throw new Error('Provider.load() did not return an item.');
			}

			// 5. Execute afterLoad hook (class method)
			let data = await this.afterLoad(response as T);

			// 6. Execute plugins afterLoad
			const afterPluginResult = await PluginManager.runHook('onAfterLoad', this, data, this.#entity);
			data = afterPluginResult.value;

			this.#found = true;
			this.#fetched = true;

			this.set(data as Partial<T>);
			this.setInitialValues(data as Partial<T>);

			// Clear changed properties since we just loaded fresh data
			this.clearChangedProperties();

			// 7. Emit load and post:load events
			this.trigger('load', { ...this.getProperties() });
			this.trigger('post:load', data);
			this.trigger('change');

			return data;
		} catch (e) {
			this.#found = false;
			this.#fetched = false;
			throw e;
		} finally {
			this.fetching = false;
		}
	}

	/**
	 * Publishes (saves) the item via the provider.
	 * Executes lifecycle hooks: beforePublish -> publish -> afterPublish
	 * Runs plugins: onBeforePublish -> onAfterPublish
	 * Emits events: pre:publish -> publish -> post:publish
	 *
	 * @param data - Optional data to publish. If not provided, uses current properties.
	 * @param options - Options for publish behavior
	 * @param options.partial - If true, only sends changed properties
	 */
	async publish(
		data?: Partial<T>,
		options: { partial?: boolean } = {}
	): Promise<Partial<T>> {
		// Determine what data to publish
		let publishData: Partial<T>;
		if (data) {
			publishData = data;
		} else if (options.partial) {
			publishData = this.getChangedValues();
		} else {
			publishData = this.getProperties();
		}

		this.processing = true;
		try {
			// 1. Execute beforePublish hook (class method)
			publishData = await this.beforePublish(publishData);

			// 2. Execute plugins beforePublish
			const pluginResult = await PluginManager.runHook('onBeforePublish', this, publishData, this.#entity);
			publishData = pluginResult.value;

			// 3. Emit pre:publish event
			this.trigger('pre:publish', publishData);

			// 4. Apply changes locally
			this.set({ ...this.getProperties(), ...publishData });
			this.#registry.setValues(this.getProperties(), true);
			super.saveChanges();

			let result: Partial<T> = this.getProperties();

			// 5. Execute provider publish if available
			if (this.provider && typeof this.provider.publish === 'function') {
				const updated = await this.provider.publish(publishData);

				if (!updated.status) {
					throw new Error('Error saving item');
				}
				this.set(updated.data as Partial<T>);
				result = updated.data as Partial<T>;
			}

			// 6. Execute afterPublish hook (class method)
			await this.afterPublish(result as T);

			// 7. Execute plugins afterPublish
			await PluginManager.runVoidHook('onAfterPublish', this, [result], this.#entity);

			// 8. Clear changed properties after successful publish
			this.clearChangedProperties();

			// 9. Emit publish and post:publish events
			this.trigger('publish', result);
			this.trigger('post:publish', result);

			return result;
		} finally {
			this.processing = false;
		}
	}

	/**
	 * Deletes the item via the provider.
	 * Executes lifecycle hooks: beforeDelete -> delete -> afterDelete
	 * Runs plugins: onBeforeDelete -> onAfterDelete
	 * Emits events: pre:delete -> delete -> post:delete
	 */
	async delete(options?: { skipProvider?: boolean }): Promise<boolean> {
		const id = this.getProperty('id' as keyof T) as ItemId;

		try {
			// 1. Execute beforeDelete hook (class method)
			const shouldDelete = await this.beforeDelete(id);
			if (!shouldDelete) {
				return false;
			}

			// 2. Execute plugins beforeDelete
			const pluginResult = await PluginManager.runHook('onBeforeDelete', this, id, this.#entity);
			if (pluginResult.cancelled) {
				return false;
			}

			// 3. Emit pre:delete event
			this.trigger('pre:delete', { id });

			this.processing = true;

			// 4. Execute provider delete if applicable
			if (!options?.skipProvider && this.provider && typeof this.provider.delete === 'function') {
				await this.provider.delete(id);
			}

			// 5. Mark as deleted in registry
			this.#registry.deleted = true;

			// 6. Execute afterDelete hook (class method)
			await this.afterDelete(id);

			// 7. Execute plugins afterDelete
			await PluginManager.runVoidHook('onAfterDelete', this, [id], this.#entity);

			// 8. Emit delete and post:delete events
			this.trigger('delete', { id });
			this.trigger('post:delete', { id });
			this.trigger('change');

			return true;
		} catch (e) {
			console.error(e);
			return false;
		} finally {
			this.processing = false;
		}
	}
}
