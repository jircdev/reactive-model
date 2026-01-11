# Migration Guide: v2.x to v3.0

This guide covers the breaking changes and migration steps for upgrading from ReactiveModel v2.x to v3.0.

## Overview of Changes

v3.0 introduces:
- Unified `IReactiveValue` interface system
- New reactive data structures (`ReactiveMap`, `ReactiveArray`, `ReactiveTree`)
- Removal of hardcoded type checks in ReactiveModel
- Deprecation of direct `map` access in Collection

## Breaking Changes

### 1. Collection.map Access (BREAKING)

**Before (v2.x):**
```typescript
const collection = new MyCollection();
await collection.load();

// Direct map access
const map = collection.map;
const item = collection.map.get('id');
```

**After (v3.0):**
```typescript
const collection = new MyCollection();
await collection.load();

// Use new methods
const item = collection.get('id');
const exists = collection.has('id');
const count = collection.size;

// For iteration
for (const [id, item] of collection.entries()) {
	// ...
}

// Or use items array
const items = collection.items;
```

**Migration Steps:**
1. Replace `collection.map.get(id)` with `collection.get(id)`
2. Replace `collection.map.has(id)` with `collection.has(id)`
3. Replace `collection.map.size` with `collection.size`
4. Replace `collection.map.forEach(...)` with `collection.forEach(...)`
5. Replace `[...collection.map.values()]` with `collection.items`

### 2. isCollection / isReactive Checks (DEPRECATED)

**Before (v2.x):**
```typescript
if (instance.isCollection) {
	instance.setItems(data);
} else if (instance.isReactive) {
	instance.set(data);
}
```

**After (v3.0):**
```typescript
import { isReactiveValue, isReactiveContainer } from '@beyond-js/reactive/model';

if (isReactiveContainer(instance)) {
	instance.setItems(data);
} else if (isReactiveValue(instance)) {
	instance.setValue(data);
}
```

### 3. Collection.delete Method Signature

**Before (v2.x):**
```typescript
// Async delete that calls provider
await collection.delete(['id1', 'id2']);
```

**After (v3.0):**
```typescript
// Sync delete (IReactiveContainer compliance)
collection.delete('id1'); // Returns boolean

// Async delete with provider
await collection.deleteAsync(['id1', 'id2']);
```

### 4. Static isReactive/isCollection Checks

**Before (v2.x):**
```typescript
if (MyClass.isCollection) {
	// ...
}
```

**After (v3.0):**
```typescript
// Use instance checks instead
if (MyClass.isContainer) {
	// ...
}

// Or better yet, check instances
const instance = new MyClass();
if (isReactiveContainer(instance)) {
	// ...
}
```

## New Features

### IReactiveValue Interface

All reactive types now implement this interface:

```typescript
interface IReactiveValue<T> {
	readonly isReactive: true;
	setValue(value: T): void;
	getValue(): T;
	serialize(): unknown;
	hasUnpublishedChanges(): boolean;
}
```

### New Methods on ReactiveModel

```typescript
// New methods available on all ReactiveModel instances
model.setValue({ ... });  // Alias for set()
model.getValue();         // Alias for getProperties()
model.serialize();        // For JSON serialization
model.hasUnpublishedChanges(); // Alias for unpublished getter
```

### New Methods on Collection

```typescript
// IReactiveContainer methods
collection.get(id);       // Get item by ID
collection.has(id);       // Check if ID exists
collection.size;          // Number of items
collection.keys();        // Iterator over IDs
collection.values();      // Iterator over items
collection.entries();     // Iterator over [id, item] pairs
collection.forEach(fn);   // Iterate with callback
collection.clear();       // Remove all items

// Utility methods
collection.find(predicate);
collection.filter(predicate);
collection.mapItems(callback);
collection.some(predicate);
collection.every(predicate);

// Async delete
collection.deleteAsync(ids);
```

### ReactiveMap

```typescript
import { ReactiveMap } from '@beyond-js/reactive/structures/map';

const map = new ReactiveMap<string, User>({
	keyExtractor: user => user.id,
});

map.set('user1', { id: 'user1', name: 'John' });
map.on('change', () => console.log('Changed'));
```

### ReactiveArray

```typescript
import { ReactiveArray } from '@beyond-js/reactive/structures/array';

const arr = new ReactiveArray<number>({ items: [1, 2, 3] });

arr.push(4, 5);
arr.on('add', ({ items }) => console.log('Added:', items));
```

### ReactiveTree

```typescript
import { ReactiveTree } from '@beyond-js/reactive/structures/tree';

const tree = new ReactiveTree<Category>({
	root: { id: 'root', name: 'Categories' },
	children: [
		{ data: { id: 'electronics', name: 'Electronics' } },
	],
});

tree.addNode('electronics', { id: 'phones', name: 'Phones' });
```

## Step-by-Step Migration

### Step 1: Update Package

```bash
npm install @beyond-js/reactive@^3.0.0
```

### Step 2: Fix Collection.map Usage

Search your codebase for:
- `\.map\.get\(`
- `\.map\.has\(`
- `\.map\.size`
- `\.map\.forEach`
- `\.map\.values()`

Replace with the new Collection methods.

### Step 3: Update Type Checks

Replace:
```typescript
if (value.isCollection)
if (value.isReactive)
```

With:
```typescript
import { isReactiveValue, isReactiveContainer } from '@beyond-js/reactive/model';

if (isReactiveContainer(value))
if (isReactiveValue(value))
```

### Step 4: Update Async Delete Calls

If you use `collection.delete()` with arrays:
```typescript
// Before
await collection.delete(['id1', 'id2']);

// After
await collection.deleteAsync(['id1', 'id2']);
```

### Step 5: Run Tests

```bash
npm test
```

Fix any failing tests related to the API changes.

## Compatibility Notes

- `collection.map` still works but shows a deprecation warning
- `isCollection` and `isReactive` static properties still exist but are deprecated
- All v2.x lifecycle hooks and events still work
- Plugin system is unchanged

## TypeScript Updates

If you have custom types that extend Collection or use its map:

```typescript
// Before
type MyMap = Collection<MyItem>['map'];

// After
// Collection no longer exposes map type directly
// Use the collection methods instead
```

## Getting Help

If you encounter issues during migration:
1. Check the [Interfaces documentation](./interfaces.md)
2. Review the new [Collection documentation](./collections.md)
3. Check the [ReactiveMap](./structures/reactive-map.md), [ReactiveArray](./structures/reactive-array.md), [ReactiveTree](./structures/reactive-tree.md) docs
