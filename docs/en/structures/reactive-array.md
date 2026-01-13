# ReactiveArray

A reactive Array implementation that emits events on changes. Implements `IReactiveContainer` for compatibility with ReactiveModel.

## Installation

```typescript
import { ReactiveArray } from 'reactive/structures/array';
```

## Basic Usage

```typescript
const items = new ReactiveArray<string>({ items: ['a', 'b', 'c'] });

// Listen to changes
items.on('change', () => {
	console.log('Items changed:', items.length);
});

// Array-like operations
items.push('d', 'e');
items.pop();
items.unshift('z');
items.shift();

// Access by index
const first = items.get(0);
items.set(0, 'new value');

// Check length
console.log(items.length); // or items.size
```

## Constructor Options

```typescript
interface IReactiveArrayOptions<T> {
	// Initial items
	items?: T[];
	
	// Emit '{index}.changed' events (default: false)
	emitIndexEvents?: boolean;
}
```

## Mutating Methods

These methods modify the array and emit events:

| Method | Description | Events |
|--------|-------------|--------|
| `push(...items)` | Add to end | `add`, `change` |
| `pop()` | Remove from end | `remove`, `change` |
| `unshift(...items)` | Add to beginning | `add`, `change` |
| `shift()` | Remove from beginning | `remove`, `change` |
| `splice(start, deleteCount, ...items)` | Insert/remove at position | `add`/`remove`, `change` |
| `sort(compareFn)` | Sort in place | `reorder`, `change` |
| `reverse()` | Reverse in place | `reorder`, `change` |
| `set(index, value)` | Set at index | `update`/`add`, `change` |
| `delete(index)` | Remove at index | `remove`, `change` |
| `clear()` | Remove all | `remove`, `clear`, `change` |

## Non-Mutating Methods

These methods return new values without modifying the array:

```typescript
// Filtering and searching
const filtered = arr.filter(x => x > 5);
const found = arr.find(x => x > 5);
const index = arr.findIndex(x => x > 5);

// Transformation
const mapped = arr.map(x => x * 2);
const reduced = arr.reduce((acc, x) => acc + x, 0);

// Testing
const hasLarge = arr.some(x => x > 100);
const allPositive = arr.every(x => x > 0);

// Access
const slice = arr.slice(1, 3);
const includesValue = arr.includes(42);
const indexOf = arr.indexOf(42);
```

## Events

| Event | Data | Description |
|-------|------|-------------|
| `add` | `{ items, index, method }` | Items were added |
| `remove` | `{ items, index, method }` | Items were removed |
| `update` | `{ index, value, previous }` | Item was updated |
| `reorder` | `{ method, items }` | Array was reordered |
| `clear` | - | Array was cleared |
| `change` | - | Any modification occurred |
| `items.changed` | `{ items }` | Bulk operation completed |

## Iteration

```typescript
// For...of
for (const item of arr) {
	console.log(item);
}

// forEach
arr.forEach((value, index) => {
	console.log(index, value);
});

// Iterators
const values = [...arr.values()];
const entries = [...arr.entries()]; // [[0, value], [1, value], ...]
const keys = [...arr.keys()]; // [0, 1, 2, ...]
```

## IReactiveValue Interface

ReactiveArray implements `IReactiveValue`:

```typescript
// Set all items
arr.setValue(['new', 'items']);

// Get all items
const items = arr.getValue();

// Serialize for JSON
const json = arr.serialize();

// Check for changes
if (arr.hasUnpublishedChanges()) {
	// Save changes
}

// Save current state as baseline
arr.saveChanges();

// Revert to last saved state
arr.revert();
```

## Example: Todo List

```typescript
interface Todo {
	id: string;
	text: string;
	completed: boolean;
}

class TodoList {
	private todos = new ReactiveArray<Todo>();

	constructor() {
		this.todos.on('change', () => this.updateUI());
	}

	add(text: string): void {
		this.todos.push({
			id: crypto.randomUUID(),
			text,
			completed: false,
		});
	}

	toggle(id: string): void {
		const index = this.todos.findIndex(t => t.id === id);
		if (index !== -1) {
			const todo = this.todos.get(index)!;
			this.todos.set(index, { ...todo, completed: !todo.completed });
		}
	}

	remove(id: string): void {
		const index = this.todos.findIndex(t => t.id === id);
		if (index !== -1) {
			this.todos.delete(index);
		}
	}

	get completed(): Todo[] {
		return this.todos.filter(t => t.completed);
	}

	get pending(): Todo[] {
		return this.todos.filter(t => !t.completed);
	}

	private updateUI(): void {
		// Re-render UI
	}
}
```

## Example: Sorted List with Automatic Reordering

```typescript
class SortedList<T> {
	private items: ReactiveArray<T>;
	private compareFn: (a: T, b: T) => number;

	constructor(compareFn: (a: T, b: T) => number) {
		this.items = new ReactiveArray<T>();
		this.compareFn = compareFn;

		// Auto-sort on add
		this.items.on('add', () => {
			this.items.sort(this.compareFn);
		});
	}

	add(item: T): void {
		this.items.push(item);
		// Will automatically sort after push
	}

	getAll(): T[] {
		return this.items.toArray();
	}
}
```
