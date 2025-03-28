````markdown
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
export interface IItemProviderResponse<T> {
	status: number;
	data?: T;
	error?: string;
	errors?: Array<{
		field: string;
		message: string;
	}>;
}

export interface IEntityProvider {
	load?(specs?: any): Promise<any>;
	list?(specs?: any): Promise<any>; // Optional, for completeness
	publish?(data: any): Promise<any>;
	remove?(specs: any): Promise<any>;
	delete?(specs?: any): Promise<any>;
}
```
````

### Example

```ts
export class UserProvider {
	async load(id: string) {
		const response = await fetch(`/api/users/${id}`);
		return await response.json();
	}

	async publish(data) {
		const response = await fetch(`/api/users`, {
			method: 'POST',
			body: JSON.stringify(data),
		});
		return await response.json();
	}

	async delete(id: string) {
		return await fetch(`/api/users/${id}`, { method: 'DELETE' });
	}
}
```

---

## 📚 Collection Providers

Used in the `Collection<T>` class to interact with a list of items.  
You must implement the `ICollectionProvider` interface:

```ts
export interface ICollectionProviderResponse<T> {
	status: number;
	data?: T;
	error?: string;
	errors?: Array<{
		field: string;
		message: string;
	}>;
}

export interface ICollectionProvider {
	load?(specs?: any): Promise<any>; // Optional (used in some setups)
	list(specs?: any): Promise<any>; // Required: fetches the list of items
	publish?(data: any): Promise<any>;
	remove?(specs?: any): Promise<any>;
}
```

### Example

```ts
export class UserCollectionProvider {
	async list(filters) {
		const params = new URLSearchParams(filters).toString();
		const response = await fetch(`/api/users?${params}`);
		return await response.json();
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

-   All methods return `Promise<any>`. The return shape is not enforced strictly yet, but a standard response with
    `status`, `data`, or `error` is encouraged.
-   These interfaces are simple by design but will evolve in future versions to support advanced patterns like
    optimistic updates, error handling, and more detailed typing.

---

## 🔮 Future Enhancements

The current provider interfaces are intentionally minimal. Upcoming improvements may include:

-   Better typing for responses
-   Automatic retry logic
-   Lifecycle hooks
-   Centralized error handling

---

## 📄 Summary

| Use Case      | Class           | Interface             |
| ------------- | --------------- | --------------------- |
| Single Entity | `Item<T>`       | `IEntityProvider`     |
| Collection    | `Collection<T>` | `ICollectionProvider` |

By following these simple interfaces, you can seamlessly integrate your models and collections with **any** data source,
while keeping your reactive logic clean and focused.
