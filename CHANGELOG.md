# CHANGELOG

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
