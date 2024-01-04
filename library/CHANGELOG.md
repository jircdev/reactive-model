# CHANGELOG

# 1.1.7

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

## 1.1.2

-   Bug fix: Fixed error when passing parameters in the Item post method.

## 1.1.1 (July 20, 2023)

### Item and collection

-   New feature: Now the methods such as save, publish, and load can be overwritten in Children objects and call super
    method. This is useful when it's necessary to manage logic before executing the method or after it.
-   Bug fix: Fixed an error when the same registry is instantiated multiple times.
