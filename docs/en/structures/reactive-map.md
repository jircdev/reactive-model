# ReactiveMap

A reactive Map implementation that emits events on changes. Implements `IReactiveContainer` for compatibility with ReactiveModel.

## Installation

```typescript
import { ReactiveMap } from 'reactive/structures/map';
```

## Basic Usage

```typescript
interface User {
	id: string;
	name: string;
	email: string;
}

const users = new ReactiveMap<string, User>({
	keyExtractor: user => user.id,
});

// Listen to changes
users.on('change', () => {
	console.log('Users changed:', users.size);
});

// Add users
users.set('user1', { id: 'user1', name: 'John', email: 'john@example.com' });
users.set('user2', { id: 'user2', name: 'Jane', email: 'jane@example.com' });

// Get user
const john = users.get('user1');

// Check existence
if (users.has('user1')) {
	console.log('User exists');
}

// Delete user
users.delete('user1');

// Clear all
users.clear();
```

## Constructor Options

```typescript
interface IReactiveMapOptions<K, V> {
	// Initial entries
	entries?: Iterable<[K, V]>;
	
	// Extract key from value (for array operations)
	keyExtractor?: (value: V) => K;
	
	// Emit '{key}.changed' events (default: true)
	emitKeyEvents?: boolean;
}
```

## Methods

### CRUD Operations

| Method | Description |
|--------|-------------|
| `get(key)` | Get value by key |
| `set(key, value)` | Set value at key |
| `has(key)` | Check if key exists |
| `delete(key)` | Delete by key |
| `clear()` | Remove all entries |

### Iteration

| Method | Description |
|--------|-------------|
| `keys()` | Iterator over keys |
| `values()` | Iterator over values |
| `entries()` | Iterator over [key, value] pairs |
| `forEach(callback)` | Execute callback for each entry |

### Batch Operations

```typescript
// Set multiple items at once
users.setItems([
	{ id: 'u1', name: 'User 1' },
	{ id: 'u2', name: 'User 2' },
], true); // true = clear existing first
```

### Utility Methods

```typescript
// Find first matching
const admin = users.find(user => user.role === 'admin');

// Filter matching
const activeUsers = users.filter(user => user.active);

// Map to new array
const names = users.map(user => user.name);

// Convert to array/map
const array = users.toArray();
const map = users.toMap();

// Save current state as baseline
users.saveChanges();

// Revert to last saved state
users.revert();
```

## Events

| Event | Data | Description |
|-------|------|-------------|
| `set` | `{ key, value, previous, isNew }` | Entry was set |
| `delete` | `{ key, value }` | Entry was deleted |
| `clear` | `{ previousSize, previousEntries }` | Map was cleared |
| `change` | - | Any modification occurred |
| `{key}.changed` | `{ value, previous }` | Specific key changed |
| `items.changed` | `{ items }` | Bulk operation completed |

## IReactiveValue Interface

ReactiveMap implements `IReactiveValue`, making it compatible with ReactiveModel properties:

```typescript
// Use as a property in ReactiveModel
class Store extends ReactiveModel<Store> {
	constructor() {
		super({
			properties: [
				{
					name: 'users',
					value: ReactiveMap,
				},
			],
		});
	}
}
```

## Change Tracking

```typescript
const map = new ReactiveMap<string, number>({
	entries: [['a', 1]],
});

console.log(map.hasUnpublishedChanges()); // false

map.set('b', 2);
console.log(map.hasUnpublishedChanges()); // true

map.saveChanges();
console.log(map.hasUnpublishedChanges()); // false
```

## Example: Configuration Store

```typescript
interface ConfigValue {
	key: string;
	value: unknown;
	updatedAt: number;
}

class ConfigStore {
	private configs = new ReactiveMap<string, ConfigValue>({
		keyExtractor: config => config.key,
	});

	constructor() {
		this.configs.on('change', () => this.persist());
	}

	get(key: string): unknown {
		return this.configs.get(key)?.value;
	}

	set(key: string, value: unknown): void {
		this.configs.set(key, {
			key,
			value,
			updatedAt: Date.now(),
		});
	}

	private persist(): void {
		localStorage.setItem('config', JSON.stringify(this.configs.serialize()));
	}
}
```
