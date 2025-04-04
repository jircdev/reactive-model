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

-   [`Item<T>`](../item/) — for single entity operations
-   [`Collection<T>`](../collection/) — for group operations

While both rely on a provider, **each one requires a different interface**, suited to its purpose.

---

## 📦 Item Providers

Used in the `Item<T>` class to interact with a single entity.  
You must implement the `IEntityProvider` interface:

```ts
// Common API response interface
export interface IAPIResponse<T> {
	status: boolean;
	data: T;
	error?: string;
	errors?: Array<{
		field: string;
		message: string;
	}>;
}

// Interface for item data
export interface IItemData {
	id: string | number;
	[key: string]: any;
}

export interface IEntityProvider {
	// Must return the item data directly, not the API response
	load?(specs?: any): Promise<IItemData>;
	publish?(data: any): Promise<IItemData>;
	delete?(specs?: any): Promise<boolean>;
}
```

### Example

```ts
export class UserProvider implements IEntityProvider {
	async load(id: string): Promise<IItemData> {
		const response = await fetch(`/api/users/${id}`);
		const result: IAPIResponse<IItemData> = await response.json();

		if (!result.status) {
			throw new Error(result.error || 'Failed to load user');
		}

		return result.data;
	}

	async publish(data: IItemData): Promise<IItemData> {
		const response = await fetch(`/api/users`, {
			method: 'POST',
			body: JSON.stringify(data),
		});
		const result: IAPIResponse<IItemData> = await response.json();

		if (!result.status) {
			throw new Error(result.error || 'Failed to publish user');
		}

		return result.data;
	}

	async delete(id: string): Promise<boolean> {
		const response = await fetch(`/api/users/${id}`, { method: 'DELETE' });
		const result: IAPIResponse<boolean> = await response.json();

		if (!result.status) {
			throw new Error(result.error || 'Failed to delete user');
		}

		return true;
	}
}
```

---

## 📚 Collection Providers

Used in the `Collection<T>` class to interact with a list of items. You must implement the `ICollectionProvider`
interface:

```ts
export interface ICollectionProvider {
	// Must return array of items directly, not the API response
	list(specs?: any): Promise<IItemData[]>;
	publish?(data: any): Promise<IItemData>;
	remove?(specs?: any): Promise<boolean>;
}
```

### Example

```ts
export class UserCollectionProvider implements ICollectionProvider {
	async list(filters?: any): Promise<IItemData[]> {
		const params = new URLSearchParams(filters).toString();
		const response = await fetch(`/api/users?${params}`);
		const result: IAPIResponse<IItemData[]> = await response.json();

		if (!result.status) {
			throw new Error(result.error || 'Failed to fetch users');
		}

		return result.data;
	}

	async publish(data: IItemData): Promise<IItemData> {
		const response = await fetch(`/api/users`, {
			method: 'POST',
			body: JSON.stringify(data),
		});
		const result: IAPIResponse<IItemData> = await response.json();

		if (!result.status) {
			throw new Error(result.error || 'Failed to publish user');
		}

		return result.data;
	}
}
```

---

## ⚙️ Key Benefits

-   ✅ Agnostic of backend or storage engine
-   ✅ Fully compatible with remote APIs or local storage
-   ✅ Uniform interface for loading, saving, deleting
-   ✅ Reusable and testable logic
-   ✅ Scales from simple files to complex data layers

---

## 🧪 Implementation Notes

-   Provider methods should handle API responses internally and return only the relevant data
-   Error handling should be done within the provider methods using try/catch blocks
-   All methods should validate the API response status before returning data
-   Methods should throw errors with meaningful messages when operations fail
-   TypeScript interfaces ensure type safety and better development experience

---

## 🔮 Future Enhancements

The provider interfaces are designed to be simple yet powerful. Future improvements may include:

-   Additional lifecycle hooks
-   Built-in caching strategies
-   Batch operation support
-   Real-time data sync capabilities

---

## 📄 Summary

| Use Case      | Class           | Return Type            |
| ------------- | --------------- | ---------------------- |
| Single Entity | `Item<T>`       | `Promise<IItemData>`   |
| Collection    | `Collection<T>` | `Promise<IItemData[]>` |

Providers handle the complexity of API interactions while providing a clean interface for your reactive models. They
validate responses, handle errors, and return only the necessary data, keeping your models focused on managing state.
