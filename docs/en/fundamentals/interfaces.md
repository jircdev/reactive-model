# Interfaces

ReactiveModel introduces a unified interface system for all reactive values. This enables polymorphic handling of different reactive types without hardcoded type checks.

## IReactiveValue

The core interface that all reactive values implement.

```typescript
interface IReactiveValue<T = unknown> {
	// Identifies as reactive
	readonly isReactive: true;

	// Core operations
	setValue(value: T): void;
	getValue(): T;

	// Serialization
	serialize(): unknown;

	// Change tracking
	hasUnpublishedChanges(): boolean;

	// Events (inherited from Events class)
	on(event: string, handler: Function): this;
	off(event: string, handler: Function): this;
	trigger(event: string, data?: unknown): void;
}
```

### Implementations

| Class | T Type |
|-------|--------|
| `ReactiveModel<T>` | `Partial<T>` |
| `Item<T>` | `Partial<T>` |
| `ReactiveMap<K, V>` | `V[]` |
| `ReactiveArray<T>` | `T[]` |
| `ReactiveTree<T>` | `T[]` |

### Type Guard

```typescript
import { isReactiveValue } from '@beyond-js/reactive/model';

function processValue(value: unknown) {
	if (isReactiveValue(value)) {
		// TypeScript knows value is IReactiveValue
		console.log(value.getValue());
		value.on('change', () => console.log('Changed'));
	}
}
```

## IReactiveContainer

Extension of `IReactiveValue` for collection-like structures.

```typescript
interface IReactiveContainer<T, K = string | number> extends IReactiveValue<T[]> {
	// Identifies as container
	readonly isContainer: true;
	readonly size: number;

	// CRUD operations
	get(key: K): T | undefined;
	set(key: K, value: T): void;
	has(key: K): boolean;
	delete(key: K): boolean;
	clear(): void;

	// Iteration
	keys(): IterableIterator<K>;
	values(): IterableIterator<T>;
	entries(): IterableIterator<[K, T]>;
	forEach(callback: (value: T, key: K) => void): void;

	// Batch operations
	setItems(items: T[] | Map<K, T>, clear?: boolean): void;
}
```

### Implementations

| Class | T Type | K Type |
|-------|--------|--------|
| `Collection<T>` | `Item` | `ItemId` |
| `ReactiveMap<K, V>` | `V` | `K` |
| `ReactiveArray<T>` | `T` | `number` |

### Type Guard

```typescript
import { isReactiveContainer } from '@beyond-js/reactive/model';

function processContainer(value: unknown) {
	if (isReactiveContainer(value)) {
		// TypeScript knows value is IReactiveContainer
		console.log('Size:', value.size);
		
		for (const item of value.values()) {
			console.log(item);
		}
	}
}
```

## Usage in ReactiveModel

The interfaces enable clean handling of nested reactive properties:

```typescript
class Order extends ReactiveModel<Order> {
	constructor() {
		super({
			properties: [
				'id',
				'status',
				// Nested reactive value
				{
					name: 'items',
					value: Collection, // Implements IReactiveContainer
				},
				// Custom reactive map
				{
					name: 'metadata',
					value: ReactiveMap,
				},
			],
		});
	}
}

// The model handles all IReactiveValue properties uniformly
const order = new Order();

// Setting nested values uses setValue() internally
order.set({
	items: [{ id: '1', name: 'Product' }], // Collection.setValue()
	metadata: [['key', 'value']], // ReactiveMap.setValue()
});

// Getting values uses serialize()
const json = order.getProperties();
// { id: ..., items: [...], metadata: [...] }
```

## Polymorphic Patterns

### Handling Unknown Reactive Values

```typescript
function handleReactiveValue(value: IReactiveValue): void {
	// Common operations work on all reactive values
	value.on('change', () => console.log('Changed'));
	
	const data = value.getValue();
	const serialized = value.serialize();
	
	if (value.hasUnpublishedChanges()) {
		// Needs saving
	}
}
```

### Distinguishing Containers

```typescript
function processData(value: IReactiveValue): void {
	if (isReactiveContainer(value)) {
		// It's a container - use container methods
		console.log('Items:', value.size);
		
		for (const [key, item] of value.entries()) {
			console.log(key, item);
		}
	} else {
		// It's a simple model
		console.log('Properties:', value.getValue());
	}
}
```

## Benefits

1. **No Type Checking**: The base ReactiveModel no longer needs to check `isCollection` or `isReactiveModel`.

2. **Extensibility**: Create new reactive types that work seamlessly with existing code.

3. **Polymorphism**: Handle all reactive values uniformly.

4. **Type Safety**: TypeScript understands the interface contracts.

## Creating Custom Reactive Types

```typescript
import { Events } from '@beyond-js/reactive/events';
import type { IReactiveValue } from '@beyond-js/reactive/model';

class ReactiveGraph<T> extends Events implements IReactiveValue<T[]> {
	readonly isReactive: true = true;
	
	private nodes: Map<string, T> = new Map();
	private edges: Map<string, Set<string>> = new Map();
	
	setValue(values: T[]): void {
		// Implementation
	}
	
	getValue(): T[] {
		return [...this.nodes.values()];
	}
	
	serialize(): { nodes: T[]; edges: [string, string][] } {
		// Custom serialization
	}
	
	hasUnpublishedChanges(): boolean {
		// Track changes
	}
}
```

This custom type can now be used as a ReactiveModel property and will be handled correctly.
