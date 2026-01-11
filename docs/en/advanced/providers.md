# Providers

**Providers** are a key concept in the ReactiveModel system. They allow you to decouple data access logic from the
reactive state itself. By implementing a simple interface, providers make it possible to integrate your models and
collections with any kind of data source — from local storage and IndexedDB to SQL, NoSQL, REST APIs, or even file
systems.

---

## 🎯 Purpose

The main goal of a provider is to **externalize persistence logic** so the reactive layer (items and collections) can
remain agnostic of how data is fetched, stored, or updated.

This enables:

-   Clean separation of concerns
-   Easier testing and mocking
-   Plug-and-play integration with various backends or storage engines
-   Uniform handling of local and remote data sources

---

## 🔁 Shared Concept

The provider concept is used in both:

-   [`Item<T>`](../entities/items.md) — for single entity operations
-   [`Collection<T>`](../entities/collections.md) — for group operations

While both rely on a provider, **each one requires a different interface**, suited to its purpose.

---

## 📦 Item Providers

Used in the `Item<T>` class to interact with a single entity. You must implement the `IEntityProvider` interface:

### Interface

```ts
export interface IEntityProvider {
	load?(specs?: any): Promise<any>;
	list?(specs?: any): Promise<any>;
	publish?(data: any): Promise<any>;
	remove?(specs: any): Promise<any>;
	delete?(specs?: any): Promise<any>;
	deleteMany?(specs?: any): Promise<any>;
}
```

### Key Methods

-   **`load(specs?)`**: **(Optional)** Fetches a single item by ID or other criteria. Should return the item data
    directly (not wrapped in a response object).
-   **`publish(data)`**: **(Optional)** Saves or updates an item. Should return the updated item data directly.
-   **`delete(specs?)`**: **(Optional)** Deletes an item. Should return `true` if successful, or throw an error if it
    fails.

### Example

```ts
import { IEntityProvider } from '@beyond-js/reactive/entities/item';

interface IUser {
	id: string;
	name: string;
	email: string;
}

export class UserProvider implements IEntityProvider {
	async load(id: string): Promise<IUser> {
		const response = await fetch(`/api/users/${id}`);

		if (!response.ok) {
			throw new Error(`Failed to load user: ${response.statusText}`);
		}

		const result = await response.json();

		// Handle API response structure if needed
		// Return only the data, not the response wrapper
		return result.data || result;
	}

	async publish(data: IUser): Promise<IUser> {
		const response = await fetch(`/api/users`, {
			method: data.id ? 'PUT' : 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data),
		});

		if (!response.ok) {
			throw new Error(`Failed to publish user: ${response.statusText}`);
		}

		const result = await response.json();
		return result.data || result;
	}

	async delete(id: string): Promise<boolean> {
		const response = await fetch(`/api/users/${id}`, {
			method: 'DELETE',
		});

		if (!response.ok) {
			throw new Error(`Failed to delete user: ${response.statusText}`);
		}

		return true;
	}
}
```

### Usage in Item

```ts
import { Item } from '@beyond-js/reactive/entities/item';
import { UserProvider } from './user-provider';

class User extends Item<IUser, UserProvider> {
	declare id: string;
	declare name: string;
	declare email: string;

	constructor() {
		super({
			entity: 'users',
			provider: UserProvider,
			properties: ['id', 'name', 'email'],
		});
	}
}

// Usage
const user = new User();
await user.load('123'); // Calls UserProvider.load('123')
await user.publish({ name: 'John' }); // Calls UserProvider.publish({...})
await user.delete('123'); // Calls UserProvider.delete('123')
```

---

## 📚 Collection Providers

Used in the `Collection<T>` class to interact with a list of items. You must implement the `ICollectionProvider`
interface:

### Interface

```ts
export interface ICollectionProvider {
	load(specs?: any): Promise<any>;
	list(specs?: any): Promise<any>;
	publish?(data: any): Promise<any>;
	remove?(specs?: any): Promise<any>;
}
```

### Key Methods

-   **`load(specs?)`** or **`list(specs?)`**: **(Required)** Fetches a list of items. Should return either:
    -   An array of items directly: `Promise<ItemData[]>`
    -   An object with pagination info: `Promise<{ items: ItemData[], next?: string, total?: number }>`
-   **`publish(data)`**: **(Optional)** Creates or updates items in bulk.
-   **`remove(specs?)`**: **(Optional)** Removes items from the collection.

### Example

```ts
import { ICollectionProvider } from '@beyond-js/reactive/entities/collection';

interface ILoadSpecs {
	where?: any;
	orderBy?: any;
	limit?: number;
	next?: string; // Pagination cursor
}

export class UserCollectionProvider implements ICollectionProvider {
	async list(specs?: ILoadSpecs): Promise<IUser[] | { items: IUser[]; next?: string; total?: number }> {
		const params = new URLSearchParams();

		// Add filters
		if (specs?.where) {
			params.append('filters', JSON.stringify(specs.where));
		}

		// Add pagination
		if (specs?.next) {
			params.append('cursor', specs.next);
		}

		if (specs?.limit) {
			params.append('limit', specs.limit.toString());
		}

		const response = await fetch(`/api/users?${params.toString()}`);

		if (!response.ok) {
			throw new Error(`Failed to fetch users: ${response.statusText}`);
		}

		const result = await response.json();

		// Return array or paginated response
		if (result.items) {
			// Paginated response: { items: [...], next: '...', total: 100 }
			return result;
		}

		// Simple array response
		return result.data || result;
	}

	async publish(data: IUser): Promise<IUser> {
		const response = await fetch(`/api/users`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data),
		});

		if (!response.ok) {
			throw new Error(`Failed to publish user: ${response.statusText}`);
		}

		const result = await response.json();
		return result.data || result;
	}
}
```

### Usage in Collection

```ts
import { Collection } from '@beyond-js/reactive/entities/collection';
import { User } from './user';
import { UserCollectionProvider } from './user-collection-provider';

class Users extends Collection<User, UserCollectionProvider> {
	constructor() {
		super({
			entity: 'users',
			provider: UserCollectionProvider,
			item: User,
		});
	}
}

// Usage
const users = new Users();
await users.load({ limit: 20 }); // Calls UserCollectionProvider.list({ limit: 20 })
await users.load({ update: true }); // Loads next page using internal cursor
```

---

## ⚙️ Key Benefits

-   ✅ **Agnostic of backend or storage engine**: Works with REST APIs, GraphQL, IndexedDB, SQL, etc.
-   ✅ **Fully compatible with remote APIs or local storage**: Implement once, use anywhere
-   ✅ **Uniform interface**: Same pattern for loading, saving, deleting
-   ✅ **Reusable and testable**: Easy to mock for unit tests
-   ✅ **Scales from simple files to complex data layers**: Start simple, evolve as needed

---

## 🧪 Implementation Best Practices

### Error Handling

Provider methods should handle errors internally and throw meaningful errors:

```ts
async load(id: string): Promise<IUser> {
	try {
		const response = await fetch(`/api/users/${id}`);

		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		}

		const data = await response.json();
		return data.data || data;
	} catch (error) {
		// Log error if needed
		console.error('Failed to load user:', error);
		// Re-throw with context
		throw new Error(`Failed to load user ${id}: ${error.message}`);
	}
}
```

### Response Transformation

Providers should return **only the data**, not the API response wrapper:

```ts
// ❌ Bad: Returning the entire response
async load(id: string) {
	const response = await fetch(`/api/users/${id}`);
	return await response.json(); // Returns { status: true, data: {...} }
}

// ✅ Good: Returning only the data
async load(id: string): Promise<IUser> {
	const response = await fetch(`/api/users/${id}`);
	const result = await response.json();
	return result.data; // Returns just the user object
}
```

### Type Safety

Use TypeScript interfaces to ensure type safety:

```ts
interface IUser {
	id: string;
	name: string;
	email: string;
}

export class UserProvider implements IEntityProvider {
	async load(id: string): Promise<IUser> {
		// TypeScript ensures the return type matches IUser
		// ...
	}
}
```

---

## 🔮 Advanced Usage

### Custom Provider Logic

You can add custom logic to your providers:

```ts
export class UserProvider implements IEntityProvider {
	private cache = new Map<string, IUser>();

	async load(id: string): Promise<IUser> {
		// Check cache first
		if (this.cache.has(id)) {
			return this.cache.get(id)!;
		}

		const user = await this.fetchFromAPI(id);
		this.cache.set(id, user);
		return user;
	}

	private async fetchFromAPI(id: string): Promise<IUser> {
		const response = await fetch(`/api/users/${id}`);
		const result = await response.json();
		return result.data;
	}
}
```

### Batch Operations

For collections, you can implement batch operations:

```ts
export class UserCollectionProvider implements ICollectionProvider {
	async list(specs?: ILoadSpecs): Promise<IUser[]> {
		// Handle batch loading, filtering, etc.
		// ...
	}

	async deleteMany(ids: string[]): Promise<boolean> {
		const response = await fetch('/api/users/batch', {
			method: 'DELETE',
			body: JSON.stringify({ ids }),
		});
		return response.ok;
	}
}
```

---

## 📄 Summary

| Use Case      | Class           | Interface             | Return Type                                                |
| ------------- | --------------- | --------------------- | ---------------------------------------------------------- |
| Single Entity | `Item<T>`       | `IEntityProvider`     | `Promise<ItemData>`                                        |
| Collection    | `Collection<T>` | `ICollectionProvider` | `Promise<ItemData[]>` or `Promise<{ items, next, total }>` |

Providers handle the complexity of API interactions while providing a clean interface for your reactive models. They
validate responses, handle errors, and return only the necessary data, keeping your models focused on managing state and
reactivity.
