# Item

The `Item` class is an abstract class that extends `ReactiveModel`. This class represents a "reactive" object in the sense that it can handle changes in its properties and automatically update other parts of the code, thanks to the inheritance from `ReactiveModel`.

`Item` has a local provider (`LocalProvider`) and a remote provider (`provider`). The local provider handles the loading and storing operations in the local database (such as IndexedDB), while the remote provider interacts with an external server.

The `Item` class also includes instances of `ItemSaveManager` and `ItemLoadManager` to handle save and load operations, respectively. These managers work in conjunction with the local and remote providers to synchronize the data.

The following usage example creates a `User` class that extends `Item`:

```ts
import { Item, IItem } from '@beyond-js/reactive/entities';
import { UserProvider } from '@beyond-js/reactive/tests/backend/provider';

interface IUser {
	name?: string;
	password: string;
	lastnames: string;
}
interface ISpecs {
	id?: string;
}
export /*bundle */
class User extends Item<IUser> {
	protected properties = ['id', 'name', 'lastname'];

	constructor({ id = undefined }: ISpecs) {
		super({ storeName: 'user', db: 'test', id, provider: UserProvider });
	}
}

```

In this example, the `User` class is defined, which inherits from `Item`. The `User` class has properties such as `id`, `name`, and `lastname`, and it uses a `UserProvider` user provider to interact with an external server. It also defines the name of the local store (`storeName`) and the name of the local database (`db`).

To use this class, simply instantiate a `User` object and use its inherited methods like `save`, `load`, `sync`, etc., to interact with the local and remote database.


## Properties
- `isUnpublished: boolean `
Returns a boolean value indicating whether the item is unpublished, meaning its data has not been published to the remote server.
- `skeleton: Array<string>`
 An array of strings representing the skeleton properties of the item. These properties are used when retrieving or saving data.

- `unique: Array<string>`
 An array of strings representing the unique properties of the item. These properties are used to determine the uniqueness of the item.

## Public Methods
- ` save(data?: any): Promise<{ status: boolean }>`
 Saves the item's data to the local database and publishes it to the remote server if it is unpublished. If data is provided, it sets the item's properties with the given data before saving. Returns a promise that resolves to an object with a status property indicating the success of the operation.

- `publish(): Promise<{ status: boolean, data?: any, error?: any }>`  
	Publishes the item's data to the remote server. If the item has a local provider and is online, it saves the published data to the local database. Returns a promise that resolves to an object with a status property indicating the success of the operation. If successful, the data property contains the published data.

- `sync()`
	Syncs the item's data between the local database and the remote server. It publishes any unpublished data to the server and retrieves any new data from the server. This method is typically used to synchronize data when transitioning from an offline to an online state.

- `load(params: any): Promise<{ status: boolean, data?: any, error?: any }>`
	
	Loads the item's data from the local database and, if online, retrieves the latest data from the remote server. If params is provided, it can be used to specify additional parameters for loading the data. Returns a promise that resolves to an object with a status property indicating the success of the operation. If successful, the data property contains the loaded data.


