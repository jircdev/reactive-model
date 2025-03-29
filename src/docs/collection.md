# Collection

The `Collection<T>` class represents a reactive group of items in the ReactiveModel system. It handles loading,
filtering, and managing multiple instances of a defined `Item`, ensuring synchronization with a shared registry and
support for dynamic updates from external data sources.

This class is designed to work with domain-specific `Item` models and their corresponding `ICollectionProvider`,
enabling reactive collections that automatically reflect backend or external changes.

---

## 🧩 Inheritance

-   Extends: `Model<Collection<T, P>>`
-   Integrates with: `Item<T>`, `RegistryFactory`, and `ICollectionProvider`

---

## 🧪 Basic Usage

> 💡 To better understand how **providers** work and how to implement them, see the
> &nbsp;[providers documentation](./providers).

```ts
import { Collection } from '@beyond-js/reactive/entities/collection';
import { User } from './user'; // Must extend Item
import { UserProvider } from './user-provider';

class Users extends Collection<User, UserProvider> {
	constructor() {
		super({
			entity: 'users',
			provider: UserProvider,
			item: User,
		});
	}
}
```

````

---

## 📦 Constructor

```ts
new Collection({
  entity: string;
  provider?: class implements ICollectionProvider;
  item: class extends Item;
})
```

### Parameters

-   `entity`: **(required)** Identifier for the collection type
-   `provider`: **(optional)** Data provider for remote operations
-   `item`: **(required)** The `Item` class to instantiate on data load

---

## 🔑 Key Properties

| Property   | Type                  | Description                                        |
| ---------- | --------------------- | -------------------------------------------------- |
| `entity`   | `string`              | Name of the collection’s data type                 |
| `Item`     | `typeof Item<T>`      | Reference to the `Item` class                      |
| `provider` | `ICollectionProvider` | Optional data source with `list()` and `publish()` |
| `items`    | `T[]`                 | Current items in the collection                    |
| `map`      | `Map<ItemId, T>`      | Internal map of items by ID                        |

---

## 📡 Events

| Event           | Triggered When                           |
| --------------- | ---------------------------------------- |
| `load`          | After successful load and initialization |
| `items.changed` | When items are added or removed          |
| `change`        | On any mutation to collection state      |

---

## ⚙️ Methods

### `async load(args?: ILoadSpecs<T>): Promise<T[]>`

Loads items from the provider using optional filtering, ordering, and pagination arguments.

```ts
await users.load({
	where: { status: { equals: 'active' } },
	orderBy: { name: 'asc' },
	limit: 20,
});
```

> 💡 **Note**: The filters used in the `where` clause are fully customizable.
> The documented structure (e.g., `equals`, `in`, `gt`, etc.) is a recommendation for compatibility with common
> databases like IndexedDB, SQL, or MongoDB.
> You are free to define any structure as long as your provider knows how to interpret it.

### Recommended Operators

-   `equals`, `not`, `in`, `notIn`
-   `contains`, `startsWith`, `endsWith`
-   `gt`, `gte`, `lt`, `lte`

---

### `setItems(data: any[], clear?: boolean): void`

Adds items to the collection from raw data.
If `clear` is true, replaces all current items.

---

### `getProperties(): { items: T[] }`

Returns an object containing the collection's current items.

---

### `getItemProperties(): object[]`

Returns a plain array of property snapshots (`getProperties()`) from each item.

---

### `set(data: Partial<T>): any`

Overrides `Model.set()` to update collection-level properties and emit `change`.

---

## 🔁 Registry Integration

This collection listens to `RegistryFactory` events:

-   `record.published`: Adds matching items to the collection if they match filters.
-   `record.deleted`: Removes deleted items from the collection.

These events ensure reactive updates across shared registry state.

---

## 🧠 Filtering with `matchesFilters`

Before adding new registries to the collection, they are tested against the defined filters from the latest `load()`
call.
Supports logical `AND` and `OR` conditions, as well as nested filters.

> 🔎 Filters are matched in-memory using the `matchesFilters()` logic after `load()`, so consistent formatting between
> your filters and your provider implementation is encouraged.

---

## 🧩 Example: Collection with Filtered Sync

```ts
await users.load({
	where: {
		status: { equals: 'active' },
		age: { gte: 18 },
	},
});

// When a new user is published matching this filter,
// it will be added automatically to the collection.
```

---

## 🔌 Provider Interface

The optional provider should implement:

```ts
interface ICollectionProvider {
	list(specs?: any): Promise<any>;
	load?(specs?: any): Promise<any>;
	publish?(data: any): Promise<any>;
	remove?(specs?: any): Promise<any>;
}
```

---

## 📄 License

MIT © BeyondJS
````
