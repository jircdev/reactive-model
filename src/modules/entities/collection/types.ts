import {
	IEntityProvider,
	IItem,
	Item,
	ItemId,
} from '@beyond-js/reactive/entities/item';
import type { Collection } from './';

/**
 * Standard response format from collection provider operations.
 */
export /*bundle*/ interface ICollectionProviderResponse<T> {
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
 * Response format for list operations.
 * Can be either a simple array or an object with pagination info.
 */
export /*bundle*/ interface IListResponse<T> {
	/** Array of items */
	items: T[];
	/** Total count of available items (for pagination) */
	total?: number;
	/** Cursor for next page */
	next?: unknown;
}

/**
 * Interface for Collection data providers.
 * Providers handle communication with external data sources (APIs, databases, etc.)
 */
export /*bundle*/ interface ICollectionProvider {
	/**
	 * Load/list items with optional filtering and pagination.
	 * @deprecated Use list() instead
	 */
	load?(specs?: ILoadSpecs<unknown>): Promise<unknown[] | IListResponse<unknown>>;

	/**
	 * List items with optional filtering and pagination.
	 * Should return either an array or { items: [], total?: number, next?: any }
	 */
	list(specs?: ILoadSpecs<unknown>): Promise<unknown[] | IListResponse<unknown>>;

	/**
	 * Save/create a new item in the collection.
	 */
	publish?(data: unknown): Promise<ICollectionProviderResponse<unknown>>;

	/**
	 * Remove items from the collection.
	 */
	remove?(specs?: unknown): Promise<boolean>;

	/**
	 * Delete multiple items by IDs.
	 */
	deleteMany?(ids: ItemId[]): Promise<boolean>;
}

/**
 * Constructor options for Collection class.
 */
export /*bundle*/ interface ICollectionOptions<T extends Item<IItem>, P extends Partial<IEntityProvider>> {
	/** Entity name for registry */
	entity: string;
	/** Default page size for load operations */
	defaultLimit?: number;
	/** Provider class constructor */
	provider?: new (parent: Collection<T, P>) => P;
	/** Item class constructor */
	item: new (specs: Record<string, unknown>) => T;
	/**
	 * Name of the parameter to send as pagination cursor (default: "next").
	 * Used internally by Collection to send the cursor to the provider.
	 */
	nextParamName?: string;
}

/**
 * Filter operators for querying collections.
 */
export /*bundle*/ interface IFilterOperators<V> {
	/** Exact match */
	equals?: V;
	/** Not equal */
	not?: V;
	/** Value is in array */
	in?: V[];
	/** Value is not in array */
	notIn?: V[];
	/** String contains (strings only) */
	contains?: string;
	/** String starts with (strings only) */
	startsWith?: string;
	/** String ends with (strings only) */
	endsWith?: string;
	/** Greater than */
	gt?: V;
	/** Greater than or equal */
	gte?: V;
	/** Less than */
	lt?: V;
	/** Less than or equal */
	lte?: V;
}

/**
 * Interface defining the specifications for data loading, filtering, sorting, and pagination.
 */
export /*bundle*/ interface ILoadSpecs<T> {
	/**
	 * If true, new items are appended to the collection instead of replacing them (for pagination).
	 */
	update?: boolean;

	/**
	 * Filters to apply when loading data.
	 * Each filter can be a property of the data item with various operators.
	 *
	 * @example
	 * ```typescript
	 * await users.load({
	 *   where: {
	 *     name: { contains: 'John' },
	 *     age: { gte: 18, lte: 65 },
	 *     status: { in: ['active', 'pending'] }
	 *   }
	 * });
	 * ```
	 */
	where?: {
		[K in keyof T]?: IFilterOperators<T[K]>;
	} & {
		/** Logical AND - all conditions must match */
		AND?: Array<{ [K in keyof T]?: IFilterOperators<T[K]> }>;
		/** Logical OR - at least one condition must match */
		OR?: Array<{ [K in keyof T]?: IFilterOperators<T[K]> }>;
	};

	/**
	 * Specifies the order in which results should be returned.
	 *
	 * @example
	 * ```typescript
	 * await users.load({
	 *   orderBy: {
	 *     name: 'asc',
	 *     createdAt: 'desc'
	 *   }
	 * });
	 * ```
	 */
	orderBy?: {
		[K in keyof T]?: 'asc' | 'desc';
	};

	/**
	 * Maximum number of items to load (for pagination).
	 */
	limit?: number;
}
