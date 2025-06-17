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
  nextParamName?: string; // Optional: name of the pagination parameter (default: "next")
})
```

### Parameters

-   `entity`: **(required)** Identifier for the collection type
-   `provider`: **(optional)** Data provider for remote operations
-   `item`: **(required)** The `Item` class to instantiate on data load
-   `nextParamName`: **(optional)** Name of the pagination parameter sent to the provider. Defaults to `"next"`. Use this if your provider expects a different key (e.g., `"cursor"`, `"start"`).

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

## 📖 Pagination

### Internal Pagination Handling

- The collection now manages pagination using an internal cursor (by default, the `next` property).
- The parameter name for the cursor sent to the provider can be customized using the `nextParamName` option in the constructor.
- When loading more data (pagination), simply call `load({ update: true })`. The collection will send the current cursor value to the provider using the configured parameter name.
- The provider should return either an array or an object with `{ items, next, total }`.
- The `next` (or custom) value will be updated automatically after each load.
- The `getNext()` method returns the current cursor value, and `getTotal()` returns the total number of available items (if provided).

### Example: Custom Pagination Parameter

```ts
class Users extends Collection<User, UserProvider> {
  constructor() {
    super({
      entity: 'users',
      provider: UserProvider,
      item: User,
      nextParamName: 'start', // Use 'start' as the pagination parameter
    });
  }
}
```

### Example: Loading More Data

```ts
// Initial load
await users.load({ limit: 20 });

// Load next page (uses internal cursor)
await users.load({ update: true });
```

### Example: Provider Response

```ts
// Provider may return:
{
  items: [...], // Array of items for this page
  next: 'nextCursor', // Cursor for the next page (or null if no more pages)
  total: 100 // (optional) Total number of items available
}
```

### Migration Notes

- If you previously passed the pagination cursor manually in `load`, update your code to rely on the internal handling.
- Use `nextParamName` if your API expects a different cursor parameter name.

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
// Pagination is handled internally: you do not need to pass the pagination cursor.
// If the collection has a pagination cursor (e.g., `next` or as configured by `nextParamName`), it will be sent automatically in the request.
// The provider can return either an array or an object with `{ items, next, total }`.
// To fetch the next page, call `load({ update: true })` and the collection will use the latest cursor.
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
