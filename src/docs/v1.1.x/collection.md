# Collection

The `Collection` class extends `ReactiveModel` and represents a collection of reactive objects. It is designed to handle
the loading, storing, and synchronization of a set of items, both in a local database and on a remote server.

```typescript
import { Collection } from "@beyond-js/reactive/entities";
import { User } from "./index";
import { UserProvider } from "@beyond-js/reactive-tests/backend/provider";
interface IUsers {
  items: User[];
}
export /*bundle*/ class Users extends Collection {
  item = User;

  constructor() {
    super({
      storeName: "user",
      db: "test",
      provider: UserProvider,
      item: User,
    });
  }
}
```

In this example, the `UserCollection` class is created, which inherits from `Collection`. It is specified that the
elements of this collection will be objects of the `User` class. To use this class, you would simply instantiate a
`UserCollection` object and use inherited methods like `load`, `save`, `sync`, etc., to interact with the local and
remote database.

## Methods

The `Collection` object has several methods that handle various aspects of managing a collection of reactive objects.
These methods are designed to interact with local and remote data sources for loading, saving, and syncing data.

Here's a summary of the main methods in the `Collection` object:

1. `init(specs: ISpecs = {})`: Initializes the collection and sets up internal helper classes like
   `CollectionLocalProvider`, `CollectionSaveManager`, and `CollectionLoadManager`.

2. `load(params: any = {})`: Loads data from the local database and remote server based on the given parameters,
   processes the returned entries, and updates the collection's properties. It returns the loaded items or an error if
   the load operation fails.

3. `save(data: any[])`: Saves the given data locally using the `CollectionLocalProvider`. It is implemented in the
   `CollectionSaveManager` class.

4. `publish(data: any[])`: Publishes the given data to the remote server after saving it locally. It is also implemented
   in the `CollectionSaveManager` class.

5. `sync()`: Syncs unsynchronized data between the local database and the remote server. This method is part of the
   `CollectionSaveManager` class as well.

6. `toSync()`: Returns an array of elements to be sync.

7. `set(properties)`: Updates the properties of the `Collection` object with the given properties.

8. `trigger('change')`: Triggers an event to notify other parts of the application about changes in the collection.

9. `setOffline()`: Let's you toggle the offline mode in the current collection.

These methods provide an interface to work with the data in the collection, allowing developers to easily load, save,
publish, and sync data with local and remote sources while taking advantage of the reactive nature of the `Collection`
object.
