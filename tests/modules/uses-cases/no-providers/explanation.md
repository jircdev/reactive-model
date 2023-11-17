# Item and Collection with IndexedDB (No Providers)

## Case Use Explanation

In this module, we implement a use case where `Item` and `Collection` classes are designed to work exclusively with
IndexedDB, without relying on any local or remote data providers. The key objective is to demonstrate how these classes
can directly interact with IndexedDB for all data operations, including creating, reading, updating, and deleting (CRUD)
items.

The focus is on utilizing IndexedDB as the sole storage medium, emphasizing its capabilities for handling structured
data within the browser. This approach showcases the potential of IndexedDB in web applications where client-side
storage is crucial and demonstrates a method of managing data reactivity and integrity without external dependencies.

This module serves as a practical example of implementing sophisticated data handling mechanisms in client-side storage,
exploring the capabilities and limitations of IndexedDB in a real-world application scenario.

## Use:

In order to use the tests created for this module you need to go to localhost:950 and from the console import the
function you want to test as follows:

```js
var { functionToUse } = await beyond.import('@beyond-js/reactive-tests/uses-cases/no-providers');
```

## Tests:

The set of functions you can import and use are the following:

-   ### Item:

    -   **createAItem**:

        1. Creating a new instance of a book.
        2. Setting the book's title to "Lord of the Rings".
        3. Publishing the book and handling any potential errors.
        4. Conducting a reactive-agnostic search in IndexedDB to verify the existence and data of the book.

    -   **updateAItem**:

        1. Initiates the loading of a books collection.
        2. Handles errors if the collection cannot be loaded or if the response status is false.
        3. Logs the successful loading of the collection along with the count of items.
        4. Verifies the consistency of the loaded collection with the records in IndexedDB.

    -   **deleteAItem**:

        1. Validates if an ID is provided; if not, logs an error with instructions.
        2. Attempts to load the item with the given ID, handling errors if the item can't be loaded or found.
        3. Deletes the item and handles any errors related to the deletion process.
        4. Verifies the deletion by searching for the item in IndexedDB.

    -   **getAItem**:

        1. Validates if an ID is provided; if not, logs an error with instructions.
        2. Attempts to load the item with the given ID, handling errors if the item can't be loaded or found.
        3. Updates the 'title' property of the item to a new value.
        4. Publishes the updated item and handles any related errors.
        5. Verifies the update by searching for the item in IndexedDB.

-   ### Collection
    -   **load**:
        1. Initiates the loading of a books collection.
        2. Handles errors if the collection cannot be loaded or if the response status is false.
        3. Logs the successful loading of the collection along with the count of items.
        4. Verifies the consistency of the loaded collection with the records in IndexedDB.
