# Items

**Items** are classes that extend `ReactiveModel` and represent individual entities within a reactive application. Each item represents an identifiable entity (such as a user, product, post, etc.) that can be loaded, saved, deleted, and managed reactively.

## 🎯 What is an Item?

An `Item` is a reactive class that:
- Extends `ReactiveModel` to gain reactivity capabilities.
- Integrates with a **registry** system to persist and track its state.
- Works with **data providers** to load and save information.
- Automatically manages its **lifecycle** (load, publish, delete).

## 🧩 Inheritance

```typescript
Item<T, P> extends ReactiveModel<T>
```

- `T`: Interface defining the item's properties.
- `P`: Provider class implementing `IEntityProvider`.

## 📦 Constructor

```typescript
new Item({
  entity: string,           // Entity name (required)
  provider?: class,         // Provider class (optional)
  properties: string[],     // Array of reactive property names
  id?: string | number,     // Initial item ID (optional)
  ...initialValues          // Additional initial values
})
```

### Parameters

- `entity`: **(required)** Domain entity name (used for the registry).
- `provider`: **(optional)** Class that implements `IEntityProvider`.
- `properties`: Array of property names that will be reactive.
- `id`: Initial item ID (optional).
- `initialValues`: Additional initial values for properties.

## 🔑 Main Properties

| Property | Type | Description |
| --- | --- | --- |
| `entity` | `string` | Entity name (e.g., `'user'`). |
| `registry` | `Registry` | Internal registry manager. |
| `provider` | `object` | Data provider instance (optional). |
| `fetched` | `boolean` | `true` if `load()` was successful. |
| `found` | `boolean` | `true` if the record was found during load. |
| `draft` | `boolean` | `true` if the item is still a draft. |
| `deleted` | `boolean` | `true` if the item has been deleted. |
| `__registryState` | `string` | Registry state: `'draft'`, `'published'`, or `'deleted'`. |
| `__instanceId` | `string` | Internal instance ID for tracking. |

## ⚙️ Main Methods

### `load(args?): Promise<any>`

Loads the item using the `load()` method of the associated provider. Updates internal state with the fetched data and emits `"load"` and `"change"` events.

**Example:**

```typescript
const user = new User({ id: '1' });
await user.load();
console.log(user.name); // Name loaded from provider
```

**Parameters:**
- `args`: Optional arguments passed to the provider.

**Returns:**
- `Promise<any>`: Loaded data from the provider.

### `publish(data?): Promise<T>`

Saves changes to the item. Updates registry state and calls the provider's `publish()` method (if implemented). Saves changes as `initialValues` internally.

**Example:**

```typescript
user.set({ name: 'John' });
await user.publish(); // Saves changes
```

**With specific data:**

```typescript
await user.publish({ name: 'John', email: 'john@example.com' });
```

**Parameters:**
- `data`: Optional data to publish (defaults to current values).

**Returns:**
- `Promise<T>`: Published data.

### `delete(options?): Promise<boolean>`

Deletes the item via the provider's `delete()` method and marks the item as deleted in the registry.

**Example:**

```typescript
await user.delete(); // Deletes item
```

**Skipping provider:**

```typescript
await user.delete({ skipProvider: true }); // Only marks as deleted locally
```

**Parameters:**
- `options.skipProvider`: If `true`, doesn't call provider delete.

**Returns:**
- `Promise<boolean>`: `true` if successful.

### `set(values: Partial<T>): SetPropertiesResult`

Overrides the `Model` method to update values and sync with the registry. Triggers `set.executed` event.

## 🔄 Events

Items emit several events you can listen to:

| Event | Triggers when |
| --- | --- |
| `set.executed` | After `set()` method is called. |
| `change` | On any property update. |
| `load` | After successful `load()`. |
| `<prop>.changed` | When a specific property changes. |

**Usage Example:**

```typescript
user.on('change', () => {
  console.log('Item has changed');
});

user.on('name.changed', (value) => {
  console.log(`Name changed to: ${value}`);
});

user.on('load', (data) => {
  console.log('Item loaded:', data);
});
```

## 🛠 Provider

To enable loading, publishing, or deleting, pass a class that implements `IEntityProvider`:

```typescript
interface IEntityProvider {
  load?(args?: any): Promise<any>;
  publish?(data: any): Promise<{ status: number; data: any }>;
  delete?(id?: string | number): Promise<boolean>;
}
```

### Provider Example

```typescript
import { IEntityProvider } from 'reactive/entities/item';

export class UserProvider implements IEntityProvider {
  constructor(private parent: any) {}

  async load(args?: { id?: string }): Promise<any> {
    const id = args?.id || this.parent.getProperty('id');
    const response = await fetch(`/api/users/${id}`);
    const data = await response.json();
    
    if (!response.ok) throw new Error('Failed to load user');
    return data;
  }

  async publish(data: any): Promise<{ status: number; data: any }> {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Failed to save user');
    
    return { status: 200, data: result };
  }

  async delete(id?: string | number): Promise<boolean> {
    const userId = id || this.parent.getProperty('id');
    const response = await fetch(`/api/users/${userId}`, {
      method: 'DELETE',
    });
    
    return response.ok;
  }
}
```

## 🔍 Advanced Features

### Registry

Items integrate automatically with a registry system that maintains the state of all instances. This enables:
- **Synchronization**: Multiple instances of the same item stay in sync.
- **State Tracking**: Track `draft`, `published`, or `deleted` status.
- **Automatic Change Management**.

### Lifecycle Hooks

Items support lifecycle hooks to customize CRUD operations.

| Hook | When it runs |
| --- | --- |
| `beforeLoad(args)` | Before provider.load() |
| `afterLoad(data)` | After provider.load() |
| `beforePublish(data)` | Before provider.publish() |
| `afterPublish(data)` | After provider.publish() |
| `beforeDelete(id)` | Before provider.delete() |
| `afterDelete(id)` | After provider.delete() |

### Partial Updates

Items track which properties have changed, allowing you to send only modified data.

```typescript
const user = new User({ id: '1', name: 'John' });
user.name = 'John Doe';

console.log(user.changedProperties); // ['name']
await user.publish(undefined, { partial: true }); // Sends only 'name'
```

## 🎓 Best Practices

1.  **Define reactive properties**: Always specify all properties in the `properties` array.
2.  **Use TypeScript**: Define interfaces for items for autocomplete and type safety.
3.  **Handle errors**: Wrap `load()`, `publish()`, and `delete()` in try/catch.
4.  **Listen to events**: Use events to react to changes instead of polling.
5.  **Reuse providers**: Create reusable providers shared between similar items.
