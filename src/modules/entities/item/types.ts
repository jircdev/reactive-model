import type { Item } from './index';
import type { EntityProperty } from '@beyond-js/reactive/model';

/**
 * Base interface for Item entities.
 * All Items must have an id property.
 */
export /*bundle*/ interface IItem {
	id: string | number;
}

/**
 * Type for Item identifiers.
 */
export /*bundle*/ type ItemId = string | number;

/**
 * Reactive property definition.
 */
export type ReactiveProperty<T> = keyof T | { name: keyof T };

/**
 * Constructor options for Item class.
 */
export /*bundle*/ interface IItemProps<T, P extends IEntityProvider> {
	/** Optional initial ID */
	id?: ItemId;
	/** Provider class constructor */
	provider?: new (parent: Item<T & IItem, P>) => P;
	/** Entity name for registry */
	entity: string;
	/** Array of reactive property names or definitions */
	properties?: EntityProperty<T>[];
	/** Whether to register in the factory immediately */
	register?: boolean;
}

/**
 * Standard response format from provider operations.
 */
export /*bundle*/ interface IItemProviderResponse<T> {
	/** HTTP-like status code (200 = success) */
	status: number;
	/** The data returned by the operation */
	data?: T;
	/** Error message if operation failed */
	error?: string;
	/** Field-level validation errors */
	errors?: Array<{
		field: string;
		message: string;
	}>;
}

/**
 * Interface for Item data providers.
 * Providers handle communication with external data sources (APIs, databases, etc.)
 *
 * All methods are optional - implement only what you need.
 */
export /*bundle*/ interface IEntityProvider {
	/**
	 * Load a single item by ID or specs.
	 * Should return the item data directly (not wrapped in response object).
	 */
	load?(specs?: unknown): Promise<unknown>;

	/**
	 * List multiple items with optional filtering.
	 * Used by Collection, not typically used directly on Item.
	 */
	list?(specs?: unknown): Promise<unknown>;

	/**
	 * Save/update an item.
	 * Should return { status: number, data: T }
	 */
	publish?(data: unknown): Promise<IItemProviderResponse<unknown>>;

	/**
	 * Remove an item (alternative to delete).
	 */
	remove?(specs: unknown): Promise<boolean>;

	/**
	 * Delete an item by ID.
	 */
	delete?(id?: ItemId): Promise<boolean>;

	/**
	 * Delete multiple items by IDs.
	 * Used by Collection for bulk operations.
	 */
	deleteMany?(ids?: ItemId[]): Promise<boolean>;
}

/**
 * Props for Registry records.
 */
export /*bundle*/ type IRecordProps<T> = {
	id: ItemId;
	properties: Array<ReactiveProperty<T>>;
	[key: string]: unknown;
};
