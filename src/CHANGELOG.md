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

## Breaking Changes

1. **Separate Subpaths for `Item` & `Collection`**

    - In versions `1.1.x`, both `Item` and `Collection` objects were located under a single subpath.
    - Now, each has its **own** subpath:
        - `@beyond-js/reactive/entities/item`
        - `@beyond-js/reactive/entities/collection`
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

## New Features & Enhancements

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

## Removed

1. **IndexedDB Core Integration**
    - The library no longer includes IndexedDB support by default.
    - This is now **plugin-based**, so you only add it if your project needs offline storage.

---

### Summary

**v1.2.0** significantly improves flexibility and type safety with **Zod** integration, adds more granular **event**
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
