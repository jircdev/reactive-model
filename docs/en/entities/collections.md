# Collections

**Collections** are classes that extend `ReactiveModel` and represent reactive groups of items. They allow loading, filtering, sorting, and managing multiple instances of a defined `Item`, ensuring synchronization with a shared registry and support for dynamic updates from external data sources.

## 🎯 What is a Collection?

A `Collection` is a reactive class that:
- Manages multiple instances of a specific `Item` type.
- Loads data from external providers.
- Filters and sorts items based on specific criteria.
- Supports automatic pagination.
- Automatically synchronizes with changes in the registry.
- Adds new items automatically if they match the filters.

## 🧩 Inheritance

```typescript
Collection<T, P> extends ReactiveModel<Collection<T, P>>
```

- `T`: Item class extending `Item<any>`.
- `P`: Provider class implementing `ICollectionProvider`.

## 📦 Constructor

```typescript
new Collection({
  entity: string,              // Entity name (required)
  provider?: class,            // Provider class (optional)
  item: class,                // Item class (required)
  defaultLimit?: number,       // Default pagination limit (default: 15)
  nextParamName?: string       // Pagination parameter name (default: "next")
})
```

### Parameters

- `entity`: **(required)** Collection identifier (e.g., `'users'`).
- `provider`: **(optional)** Class that implements `ICollectionProvider`.
- `item`: **(required)** The `Item` class to instantiate when loading data.
- `defaultLimit`: **(optional)** Maximum items to load by default.
- `nextParamName`: **(optional)** Pagination parameter name sent to the provider.

## 🔑 Main Properties

| Property | Type | Description |
| --- | --- | --- |
| `entity` | `string` | Entity name. |
| `provider` | `P` | Data provider instance. |
| `Item` | `class` | Item class used in the collection. |
| `items` | `T[]` | Array of items in the collection. |
| `size` | `number` | Current number of items. |
| `total` | `number` | Total available items (if provided by provider). |
| `next` | `unknown` | Pagination cursor value. |

## ⚙️ Main Methods

### `load(args?): Promise<T[]>`

Loads items from the configured provider. If `limit` is omitted, `defaultLimit` is used. Pagination is handled internally using `nextParamName`.

**Basic Example:**

```typescript
const users = new Users();
await users.load();
console.log(users.items); // Array of users
```

**With Filters:**

```typescript
await users.load({
  where: {
    name: { contains: 'John' },
    age: { gte: 18 }
  }
});
```

**With Pagination:**

```typescript
// First page
await users.load({ limit: 10 });

// Next page (automatic)
await users.load({ limit: 10, update: true }); // Appends items without replacing
```

### Filter Operators

The collection supports various operators:

| Operator | Description | Example |
| --- | --- | --- |
| `equals` | Exact match | `{ name: { equals: 'John' } }` |
| `not` | Not equal | `{ age: { not: 18 } }` |
| `in` | Value in array | `{ status: { in: ['active', 'pending'] } }` |
| `contains` | Substring match | `{ name: { contains: 'John' } }` |
| `gt` / `gte` | Greater than / or equal | `{ age: { gt: 18 } }` |
| `lt` / `lte` | Less than / or equal | `{ age: { lt: 65 } }` |

### Logical Operators (AND/OR)

```typescript
await users.load({
  where: {
    OR: [
      { name: { contains: 'John' } },
      { email: { contains: 'john' } }
    ]
  }
});
```

## 🔄 Events

Collections emit several events:

| Event | Triggers when |
| --- | --- |
| `load` | After successful item load. |
| `change` | When the collection changes. |
| `items.changed` | When items are added, modified, or removed. |

## 🛠 Provider

Implement `ICollectionProvider` to enable data loading:

```typescript
interface ICollectionProvider {
  list(specs?: any): Promise<any[] | { items: any[], total?: number, next?: any }>;
}
```

### Example

```typescript
export class UsersProvider implements ICollectionProvider {
  async list(args?: any): Promise<{ items: any[], total: number, next?: any }> {
    const params = new URLSearchParams();
    if (args?.limit) params.append('limit', args.limit.toString());
    
    const response = await fetch(`/api/users?${params}`);
    const data = await response.json();
    
    return {
      items: data.items || data,
      total: data.total || 0,
      next: data.next || null
    };
  }
}
```

## 🔍 Advanced Features

### Registry Synchronization

Collections automatically sync with the registry. When an item is published or deleted anywhere in the app:
1. It's added if it matches filters.
2. It's removed if deleted.
3. Existing items reflect changes automatically.

### Persistent Filters

Filters are stored internally and used to validate new items from the registry.

## 🎓 Best Practices

1.  **Reasonable default limit**: Use `defaultLimit` to prevent heavy loads.
2.  **Use `update: true` for pagination**: Append items instead of replacing them.
3.  **Handle errors**: Always wrap `load()` in try/catch.
4.  **Reuse collections**: Maintain collection instances instead of recreating them.
