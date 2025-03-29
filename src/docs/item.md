# Item

The `Item<T>` class is a specialized extension of `Model<T>`, representing a single identifiable entity within a
reactive application. It integrates deeply with a registry system to persist and track the lifecycle of individual
items, including fetching, publishing, deleting, and local state management.

This class is ideal for managing domain entities like users, products, posts, etc., offering built-in mechanisms for
data persistence and event-driven updates.

> 💡 To better understand how **providers** work and how to implement them, see the
> &nbsp;[providers documentation](./providers).

---

## 🧩 Inheritance

-   Extends: `Model<T>`
-   Implements registry tracking and provider-based loading/publishing

---

## 🧪 Basic Usage

```ts
import { Item } from '@beyond-js/reactive/entities/item';

interface IUser {
	id: string;
	name: string;
}

class UserProvider {
	async load() {
		return { id: '1', name: 'Alice' };
	}
	async publish(data) {
		return { status: 200, data };
	}
}

class User extends Item<IUser, UserProvider> {
	declare id: string;
	declare name: string;

	constructor() {
		super({
			entity: 'users',
			provider: UserProvider,
			properties: ['id', 'name'],
		});
	}
}
```

---

## 🧱 Constructor

```ts
new Item({
  entity: string,
  provider?: class implements IEntityProvider,
  properties: string[],
  ...initialValues
})
```

-   `entity`: **(required)** name of the domain entity (used for registry tracking)
-   `provider`: **(optional)** class implementing `IEntityProvider`
-   `properties`: array of reactive property names

---

## 🔑 Key Properties

| Property          | Type       | Description                              |
| ----------------- | ---------- | ---------------------------------------- |
| `entity`          | `string`   | Name of the entity (e.g., `'user'`)      |
| `registry`        | `Registry` | Internal registry record manager         |
| `provider`        | `object`   | Optional data provider instance          |
| `fetched`         | `boolean`  | True if `load()` was successful          |
| `found`           | `boolean`  | True if the record was found on load     |
| `draft`           | `boolean`  | True if the item is still a draft        |
| `__registryState` | `string`   | `'draft'`, `'published'`, or `'deleted'` |
| `__instanceId`    | `string`   | Internal instance ID for tracking        |

---

## ⚙️ Methods

### `load(args?): Promise<any>`

Fetches the item using the associated provider’s `load()` method.  
Updates internal state with fetched data and emits `"load"` and `"change"` events.

```ts
await user.load();
```

---

### `publish(data?: Partial<T>): Promise<T>`

Saves changes to the item. Updates registry state and calls the provider’s `publish()` method (if implemented).  
Saves the changes as `initialValues` internally.

```ts
await user.publish();
```

---

### `delete(id?: string | number): Promise<boolean>`

Deletes the item via the provider’s `delete()` method and marks the item as deleted in the registry.

```ts
await user.delete();
```

---

### `set(values: Partial<T>): SetPropertiesResult`

Overrides the `Model` method to update values and synchronize them with the registry. Triggers `set.executed`.

---

## 🔄 Events

| Event            | Triggered When                            |
| ---------------- | ----------------------------------------- |
| `set.executed`   | After the `set()` method is called        |
| `change`         | On any property update                    |
| `load`           | After successful `load()`                 |
| `<prop>.changed` | When a specific reactive property changes |

---

## 🛠 Provider Interface

To enable data loading, publishing, or deleting, pass a class that implements `IEntityProvider`

```ts
interface IEntityProvider {
	load?(args?: any): Promise<any>;
	publish?(data: any): Promise<{ status: number; data: any }>;
	delete?(id: string | number): Promise<boolean>;
}
```
