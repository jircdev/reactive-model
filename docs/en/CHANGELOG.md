## 3.0.0

### Breaking Changes

-   **Collection.map is deprecated**: Direct access to the internal Map via `collection.map` now shows a deprecation warning. Use the new methods instead:
    -   `collection.get(id)` - Get item by ID
    -   `collection.has(id)` - Check if ID exists
    -   `collection.size` - Number of items
    -   `collection.keys()` / `collection.values()` / `collection.entries()` - Iterators
    -   `collection.forEach(callback)` - Iterate items

-   **Collection.delete() signature changed**: Now synchronous for `IReactiveContainer` compliance.
    -   `collection.delete(id)` - Sync, returns boolean
    -   `collection.deleteAsync(ids)` - Async with provider, returns Promise<boolean[]>

-   **Type checking methods deprecated**: Use interface type guards instead:
    -   ❌ `value.isCollection` / `value.isReactive`
    -   ✅ `isReactiveContainer(value)` / `isReactiveValue(value)`

### Added

-   **Core Interfaces**: Unified interface system for all reactive values
    -   `IReactiveValue<T>` - Base interface for reactive values
    -   `IReactiveContainer<T, K>` - Interface for collection-like structures
    -   `isReactiveValue()` / `isReactiveContainer()` - Type guard functions
    -   All classes (ReactiveModel, Item, Collection) now implement these interfaces

-   **ReactiveMap**: Reactive key-value Map structure
    -   `@beyond-js/reactive/structures/map`
    -   Emits `set`, `delete`, `clear`, `change` events
    -   Implements `IReactiveContainer`
    -   Supports keyExtractor for array-based operations
    -   Change tracking with `hasUnpublishedChanges()`, `saveChanges()`, `revert()`

-   **ReactiveArray**: Reactive Array structure
    -   `@beyond-js/reactive/structures/array`
    -   Reactive versions of: `push`, `pop`, `shift`, `unshift`, `splice`, `sort`, `reverse`
    -   Emits `add`, `remove`, `update`, `reorder`, `change` events
    -   Implements `IReactiveContainer`
    -   Non-mutating methods: `filter`, `map`, `find`, `some`, `every`, `reduce`

-   **ReactiveTree**: Reactive hierarchical tree structure
    -   `@beyond-js/reactive/structures/tree`
    -   Maintains parent/children relationships
    -   Path-based access: `tree.getByPath('root.child.grandchild')`
    -   Traversal: `walkDepthFirst()`, `walkBreadthFirst()`, `findNode()`, `findNodes()`
    -   Node operations: `addNode()`, `removeNode()`, `moveNode()`, `updateNode()`
    -   Emits `node.added`, `node.removed`, `node.moved`, `change` events

-   **New Collection Methods**:
    -   `get(id)` - Get item by ID
    -   `has(id)` - Check if ID exists
    -   `size` - Number of items (getter)
    -   `keys()`, `values()`, `entries()` - Iterators
    -   `forEach()` - Iterate with callback
    -   `clear()` - Remove all items
    -   `find()`, `filter()`, `mapItems()`, `some()`, `every()` - Query methods
    -   `deleteAsync()` - Async delete with provider support

-   **New ReactiveModel Methods** (IReactiveValue implementation):
    -   `setValue(value)` - Alias for `set()`
    -   `getValue()` - Alias for `getProperties()`
    -   `serialize()` - JSON serialization
    -   `hasUnpublishedChanges()` - Alias for `unpublished` getter

-   **New Documentation**:
    -   `docs/en/structures/reactive-map.md`
    -   `docs/en/structures/reactive-array.md`
    -   `docs/en/structures/reactive-tree.md`
    -   `docs/en/interfaces.md`
    -   `docs/en/migration-v3.md`

### Changed

-   **ReactiveModel**: Now implements `IReactiveValue<Partial<T>>`
    -   Removed hardcoded `isReactiveModel()` and `isCollectionModel()` checks
    -   Uses `isReactiveValue()` interface check for nested property handling
    -   Uses `serialize()` for getting nested reactive property values

-   **Item**: Now explicitly implements `IReactiveValue<Partial<T>>`
    -   Added `serialize()` method

-   **Collection**: Now implements `IReactiveContainer<T, ItemId>`
    -   Added `isContainer: true` property
    -   Static `isCollection` and `isContainer` properties (deprecated, use instance check)
    -   `setItems()` now accepts `Map<ItemId, T>` in addition to arrays

-   **Registry instanceId generation**: Changed from UUID v4 to UUID v7
    -   UUID v7 includes timestamp, providing natural time-based ordering
    -   Improves database index performance (reduces fragmentation)
    -   Better cache efficiency and easier debugging
    -   No breaking changes - same API, only ID format changes

-   **AGENTS.md**: Updated with v3.0 changes, new structures, and interface documentation

### Migration Guide

See `docs/en/migration-v3.md` for detailed migration instructions from v2.x to v3.0.

---

## 2.3.0

### Added

-   **Lifecycle Hooks**: New protected methods for intercepting CRUD operations
    -   `beforeLoad(args)` / `afterLoad(data)` - Transform load arguments and results
    -   `beforePublish(data)` / `afterPublish(data)` - Transform and react to publish operations
    -   `beforeDelete(id)` / `afterDelete(id)` - Validate and react to delete operations
    -   `beforeSet(props)` / `afterSet(props, result)` - Transform and react to property changes
    -   All hooks support async/await for asynchronous operations

-   **Lifecycle Events**: New events emitted during CRUD operations
    -   `pre:load`, `post:load` - Before and after load
    -   `pre:publish`, `post:publish` - Before and after publish
    -   `pre:delete`, `post:delete` - Before and after delete
    -   `pre:set`, `post:set` - Before and after set (via `setAsync()`)

-   **Plugin System**: Extensible architecture for adding cross-cutting concerns
    -   `IReactivePlugin` interface for defining plugins
    -   `PluginManager` for registering/unregistering plugins globally or per entity
    -   Priority-based execution order (higher priority runs first)
    -   Plugins can intercept and transform data at any lifecycle point
    -   Ideal for caching, persistence, logging, validation, and offline sync

-   **Computed Properties**: Derived properties that automatically recalculate
    -   Define via `computed` array in constructor options
    -   Specify dependencies for automatic cache invalidation
    -   Emit `<name>.changed` events when values change
    -   Values are cached until dependencies change

-   **Transactions**: Batch multiple changes with single event emission
    -   `model.transaction(() => { ... })` - Group changes
    -   Only one `change` event emitted at the end
    -   Useful for atomic updates of related properties

-   **Partial Updates**: Track and publish only changed properties
    -   `item.changedProperties` - Array of modified property names
    -   `item.getChangedValues()` - Object with only changed values
    -   `item.publish(undefined, { partial: true })` - Send only changes
    -   `item.clearChangedProperties()` - Reset tracking

-   **Async Set**: New `setAsync()` method that properly awaits lifecycle hooks
    -   Use when you need hooks to complete before continuing
    -   Emits `pre:set` and `post:set` events

-   **New Documentation**:
    -   `docs/en/services.md` - Guide for implementing service layer
    -   `docs/en/backend-usage.md` - Using ReactiveModel in Node.js/Bun
    -   `docs/en/plugins.md` - Plugin system documentation

### Changed

-   **Improved TypeScript Types**: Removed most `any` types for better type safety
    -   `IItemProps`, `IEntityProvider`, `ICollectionProvider` now use proper generics
    -   `SetPropertiesResult.errors` properly typed
    -   `ModelProperties<T>` now returns `Partial<T>` instead of `any`

-   **Updated AGENTS.md**: Comprehensive templates and conventions for AI agents
    -   Code templates for Item, Collection, Provider, Service
    -   Naming conventions and folder structure
    -   Common errors and solutions
    -   Implementation checklist

### Fixed

-   **Registry type safety**: Better typing for registry operations

---

## 2.2.0

### Changed

-   **Events System Integration**: The `@beyond-js/events` dependency has been removed and the Events system is now included as part of the `reactive` package.
    -   Previously, `reactive` depended on `@beyond-js/events` as an external dependency.
    -   Now, the Events class and its related types are bundled as part of the package under the `reactive/events` export.
    -   This change eliminates the need for `@beyond-js/events` and `@beyond-js/kernel` as external dependencies, making the package more self-contained.
    -   **Migration**: If you were importing `Events` from `@beyond-js/events/events`, update your imports to use `reactive/events` instead.
    -   **Impact**: This is a minor version bump as it maintains API compatibility while reducing external dependencies.

## 2.1.4

### Fixed

-   **Collection reset when updating via ReactiveModel.set**: Ensures collection properties clear their existing items when refreshed through the parent `set` method.
    -   Previously, calling `set` with a new list of items on a collection property appended data without removing stale entries.
    -   Now, `setItems` receives the `clear` flag so the underlying map is rebuilt before loading the incoming data, keeping the collection in sync with the provided payload.

## 2.1.2

### Fixed

-   **Collection Property Handling in ReactiveModel**: Fixed an issue in the `set` method where collection-type
    properties were not being properly identified and their items were not being set.
    -   Previously, when setting properties on a `ReactiveModel`, the code only checked if a property was reactive but
        did not distinguish between regular reactive models and collections.
    -   Now, the `set` method properly detects when a property is a collection (via `isCollection` check) and calls
        `setItems()` instead of `set()` to correctly populate the collection's items.
    -   This fix ensures that when a collection is defined as a property of a reactive model object, the items are
        properly set when calling the `set()` method.
    -   **Impact**: Collections defined as properties in model objects will now correctly receive and set their items
        when properties are updated.
    -   **Note**: The `isCollection` getter is for internal use only and may be removed in future versions. It should
        not be used directly in application code.

## 2.1.0

### Added

-   Pagination support in the `load` method:
    -   The `load` method now supports paginated result fetching using an internal `next` parameter.
    -   The name of the `next` parameter can be configured using the `nextParamName` option.
    -   A `limit` parameter was added to specify the number of results per page.
    -   Providers can now return an object in the form `{ items, next, total }` in addition to a simple array.
    -   This allows more flexible integration with paginated APIs and improves incremental data loading.
    -   Example usage:
        ```ts
        collection.load({ limit: 20 });
        // The load method will handle the `next` parameter internally.
        // provider may return: { items: [...], next: 'nextCursor', total: 100 }
        ```

## 2.0.6

### Improved

-   The `delete` method of `Item` now supports in-memory deletion and ensures communication between the registry and
    subscribed collections. This integrated improvement guarantees that, when an item is deleted, the change is properly
    reflected in memory and all related collections are notified, enhancing reactivity and state consistency.

### Added

-   Added the `addItems` method to `Collection`.
    -   **Purpose**: Allows adding multiple items to a collection at once.
    -   **Behavior**: Receives an array of items, sets them in the collection, and triggers the `items.changed` and
        `change` events to update subscribers and maintain reactivity.
    -   **Usage**:
        ```ts
        collection.addItems([{ id: 1, ... }, { id: 2, ... }]);
        ```

## 2.0.5

### Added

-   Introduced a new parameter `register` in the `Item` constructor within `IItemProps`.
    -   **Type**: `boolean`
    -   **Purpose**: Allows specification of whether collections subscribed to the defined entity need to be informed
        about this item. This is particularly useful for creating items that already exist outside the application's
        memory.
    -   **Behavior**: If `register` is set to `true`, the registry will trigger an event when the item is created to
        notify the collections. This ensures that collections are aware of items that are instantiated from external
        sources.

## 2.0.4

### Added

-   Added comprehensive JSDoc documentation to key methods in ReactiveModel:
    -   `validate`: Documents property validation against Zod schema
    -   `getProperties`: Documents property retrieval including nested objects
    -   `revert`: Documents state restoration functionality
    -   `saveChanges`: Documents state persistence functionality

## 2.0.3

### Fixed

-   Changed `triggerEvent` function in ReactiveModel to an arrow function to maintain proper `this` scope
-   Defined `triggerEvent` as deprecated, it's recommended to use `trigger` method instead.

## 2.0.1

This release introduces **Zod** integration for validations, new event-driven enhancements for property changes, a
reorganization of code structure, and a revised approach to how `Item` and `Collection` receive data from the provider.
It also changes **how properties** are defined in models—properties are now passed into the constructor rather than
defined via a `get` property.

---

### Breaking Changes

1. **Separate Subpaths for `Item` & `Collection`**

    - In versions `1.1.x`, both `Item` and `Collection` objects were located under a single subpath.
    - Now, each has its **own** subpath:
        - `reactive/entities/item`
        - `reactive/entities/collection`
    - This change **requires updating your imports**.

2. **Constructor Property Definitions**

    - Previously, the **properties** array for a model/item was defined via a **`get` property** inside the class.
    - **Now**, you must pass the **properties array** directly to the **`super()`** constructor call.
    - Example (new approach):
        ```ts
        export class MyModel extends Model {
        	constructor() {
        		super({
        			properties: ['id', 'name', 'lastname'],
        		});
        	}
        }
        ```

3. **Constructor Parameters for `Item` & `Collection`**

    - Previously, constructors could receive properties for IndexedDB integration.
    - **IndexedDB support has been removed** from the core and will be handled via plugins.
    - **New** requirement: an `"entity"` property in the constructor to identify the entity name (for plugin
      integrations or custom usage).

4. **Provider Response Format**
    - Previously, the `load` methods in both `Item` and `Collection` expected providers to return responses with a
      specific structure: `{ status: boolean, data: any }`.
    - **Now**, providers should return the raw data directly:
        - For `Collection.load()`: An array of items directly (`Item[]`)
        - For `Item.load()`: The item's data object directly (`ItemData`)
    - This change decouples the models from specific API response structures, allowing more flexibility in data
      providers.
    - Example (old approach):
        ```ts
        // Before (1.x.x)
        async load() {
            const response = await this.provider.load();
            if (response.status) {
                this.set(response.data);
            }
        }
        ```
    - Example (new approach):
        ```ts
        // Now (2.0.0)
        async load() {
            const data = await this.provider.load();
            this.set(data);
        }
        ```
    - **Migration**: Update your providers to handle API responses internally and return only the relevant data to the
      models.

---

### New Features & Enhancements

1. **Zod Integration for Validations**

    - Zod schemas can now be defined per `Model`, `Item`, or `Collection` (where applicable).
    - Provides **runtime data validation** and improved type inference.
    - Example usage:

        ```ts
        import { z } from 'zod';
        //create a getter in the model class definition
        get schema () {
            return  z.object({
        	id: z.number().min(1),
        	username: z.string().nonempty(),
        });
        }

        ```

2. **`validate` Method**

    - A new `validate()` method checks whether **all properties** of an object conform to the attached Zod schema.
    - It returns validation success/failure or throws an error (depending on your usage).

3. **`schema` Property**

    - Entities now have a `schema` property that can reference a Zod schema for validation.

4. **Property Change Events**

    - Each property **fires a custom event** on change, providing **fine-grained reactivity**.
    - The event signature: `(eventName, updatedObjectOrProperty)`.
        - The **second parameter** gives direct access to the changed property or object.

5. **`unpublished` Property**

    - A new `unpublished` flag helps track when an object has changed locally but not yet "published" or synced.
    - Useful for offline/staging workflows.

6. **Two Generics in `Item`**

    - `Item<TProps, TProvider>`:
        - **`TProps`**: interface defining the **properties**.
        - **`TProvider`**: interface defining the **provider methods**.
    - Improves TypeScript autocompletion and type safety for data + provider usage.

7. **Nested Objects in Property Definitions**

    - You can now define **nested objects** by marking a property as an object within the property definitions array.
    - This allows more complex, hierarchical data structures in a single reactive entity.

8. **`Item` & `Collection` Receive Data from the Provider**
    - Entity objects (`Item` and `Collection`) now rely on a **provider** to supply the API response.
    - The provider is responsible for capturing and validating the API response, then returning correctly structured
      data.
    - This ensures that the reactive model has **accurate**, **validated** data and centralizes API logic in the
      provider layer.

---

### Removed

1. **IndexedDB Core Integration**
    - The library no longer includes IndexedDB support by default.
    - This is now **plugin-based**, so you only add it if your project needs offline storage.

---

### Summary

**v2.0.1** significantly improves flexibility and type safety with **Zod** integration, adds more granular **event**
handling, and refactors code structure into **separate subpaths**. The key **breaking changes** to watch out for
include:

-   **Separate subpaths** for `Item` and `Collection`.
-   **Revised constructor** usage (properties array now passed to `super()`).
-   **IndexedDB** integration removed from the core (now plugin-based).
-   **Entities** must specify an `"entity"` property in the constructor.
-   **API data** is now provided via a **provider** method, which handles and validates the response before populating
    the model.

Upgrade carefully to accommodate these changes. Once updated, you'll benefit from stronger validations, more robust
event-driven behavior, and a clearer separation of concerns between data fetching and reactive state management.

Enjoy the new features and validations in **v1.2.0**!

## [1.1.13] - 2024-09-27

### Fixed

-   **Incorrect Error Handling in `save` Method**:
    -   Removed the call to `fromRemote` on the `publish` method's response, which caused incorrect error propagation.
    -   Updated the `save` method to handle the `publish` response directly and properly throw the response when
        `status: false`.
    -   The actual backend error is now returned to the client instead of the generic error message "ERROR_DATA_QUERY",
        improving debugging and error handling.

### Testing

-   Errors triggered in the backend are now correctly propagated and received by the client.

## 1.1.12

### Enhancements

-   **Types and Interfaces Improvement:** Enhanced the ReactiveModel codebase with more explicit types and corrected
    interfaces, significantly improving TypeScript compatibility and developer experience. This update ensures that
    developers leveraging TypeScript can work more efficiently with the ReactiveModel, benefiting from stronger type
    checks and more predictable behavior.

### Fixes

-   **Publish Item Remote Response Handling (#29):** Addressed an issue where the response from publishing an item
    remotely was not being correctly returned. The issue has been resolved by fine-tuning the response handling
    mechanism. Now, responses from the remote provider are accurately captured and relayed back to the client through
    the adapter mechanism. This fix ensures that the Item entity's `response` method faithfully represents the data
    provided by the remote service, enhancing reliability and data integrity in client-server communications.

## 1.1.11

#### Fixed

-   Solve problem when a item is initialized directly. Now the set method only set defined properties

## 1.1.10

#### Fixed

-   Simplified event handling in the collection loading process to fix the issue of multiple event generation.

#### Added

-   Now, ReactiveModel objects can receive an array of properties in the constructor, following the
    `IReactiveConstructorSpecs` interface:

```typescript
interface IReactiveConstructorSpecs {
	properties?: string[];
	[key: string]: any;
}
```

## 1.1.9

-   feat: enhance collections to support arbitrary 'where' params for server-side queries and client-side indexeddb
    lookups

## 1.1.7

#### Enhancements

-   **Enhanced Item Identification**: To provide more flexibility and control over item identification, the library now
    supports and prioritizes IDs defined by the backend. While client-generated IDs are still accepted, backend-defined
    IDs, when available, will be used as the primary identifier.

#### What's Changed

-   **Priority to Backend IDs**: When an ID is defined from the backend for an item, this ID will now take precedence
    over any client-generated ID. This ensures that items can be more reliably identified and managed in systems where
    backend control is paramount.

#### Implications for Existing Projects

-   **Backward Compatibility**: Existing projects will continue to function as before, using client-generated IDs.
    However, you can now enhance your item management by integrating backend-defined IDs.
-   **Enhanced Flexibility**: This update provides the flexibility to maintain existing client-side ID generation while
    also allowing for a more robust backend-driven identification system when needed.

## 1.1.6

-   Added concept of Adapters to manage responses obtained from the backend and responses returned by items and
    collections.
-   bugfix: `fetching`, `loading`, `loaded` and `found` properties work correctly

## 1.1.5

-   Added initialise method to be called in item constructors. This method allows you to ensure
-   execute logic in the instance of the object that requires the management of the properties defined in the item.

## 1.1.3

-   Added a validation in the localProvider of the Collection class to check if the specified store exists in the
    database. If the store does not exist, an error will be thrown to handle the situation appropriately.

### 1.1.2

-   Bug fix: Fixed error when passing parameters in the Item post method.

## 1.1.1 (July 20, 2023)

### Item and collection

-   New feature: Now the methods such as save, publish, and load can be overwritten in Children objects and call super
    method. This is useful when it's necessary to manage logic before executing the method or after it.
-   Bug fix: Fixed an error when the same registry is instantiated multiple times.

## [Unreleased]

### Added

-   **Bulk Deletion in Collections**: The `Collection` class now features a new `delete` method that enables the removal
    of one or multiple items by their IDs. This method accepts either a single `ItemId` or an array of `ItemId` values.

    -   **Provider Integration**: If the associated provider implements a `deleteMany` method, `Collection.delete` will
        invoke it to synchronize deletions with an external data layer (such as a backend API or database). This ensures
        that deletions are reflected both in memory and in the persistent data source.
    -   **In-Memory Fallback**: If the provider does not define a `deleteMany` method, the `delete` method will remove
        the specified items from the collection's in-memory map only.
    -   **Usage**:

        ```ts
        // Delete a single item
        await collection.delete(itemId);

        // Delete multiple items
        await collection.delete([itemId1, itemId2, itemId3]);
        ```

    -   **Return Value**: Returns a promise that resolves to an array of booleans, indicating the success of each
        deletion operation.
