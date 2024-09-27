# CHANGELOG

# Changelog

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
