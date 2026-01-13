# ReactiveModel

The `ReactiveModel<T>` is the fundamental base class for defining reactive entities within the ReactiveModel library. It provides a structured way to declare reactive properties, manage validation, handle lifecycle states, and work with event-based behavior.

This class is designed to be extended to define domain-specific data models, such as users, products, configurations, etc.

## ✨ Key Benefits and Features

ReactiveModel offers powerful features that make working with reactive data simpler and more efficient:

### 🎯 Items and Collections Management

-   **Items**: Management of individual entities with complete lifecycle (load, save, delete)
-   **Collections**: Management of item groups with filtering, sorting, and automatic pagination
-   **Automatic synchronization**: Changes are automatically reflected in all instances

### 📡 Reactive Event System

-   **Property events**: Listen to changes in specific properties (`user.on('name.changed', ...)`)
-   **Global events**: Listen to general changes (`user.on('change', ...)`)
-   **Custom events**: Trigger your own events with `trigger()`
-   **Granular reactivity**: Each change triggers specific events, enabling precise UI updates

### ✅ Zod Validation

-   **Native integration**: Define Zod schemas using a `schema` getter
-   **Automatic validation**: Validates automatically when using `set()`
-   **Manual validation**: Use `validate()` to validate without updating
-   **Detailed error messages**: Errors structured by property

### 🔌 Data Source Decoupling

-   **Providers**: Data access logic completely decoupled
-   **Flexibility**: Works with REST APIs, GraphQL, IndexedDB, localStorage, etc.
-   **Testable**: Easy to mock providers for testing
-   **Reusable**: The same model can use different providers depending on context

### 🎨 TypeScript and Autocomplete

-   **Type-safe**: TypeScript knows the types of all properties
-   **Autocomplete**: IDE automatically completes property names and types
-   **Type validation**: Type errors detected at compile time

### 🔄 State Management

-   **Unpublished state**: Automatically detects if the model has been modified
-   **Draft state**: Identifies new unsaved models
-   **Revert changes**: Restores initial state with `revert()`
-   **Save changes**: Marks state as saved with `saveChanges()`

### 🌳 Nested Properties

-   **Reactive objects**: You can have Items or Collections as properties
-   **Cascading reactivity**: Changes in nested objects propagate correctly
-   **Relationship modeling**: Model complex relationships between entities

## 🧩 Inheritance

```typescript
ReactiveModel<T> extends Events
```

-   `T`: TypeScript interface that defines the shape of the model data

## 📦 Constructor

```typescript
new ReactiveModel(options?: IReactiveModelOptions<T>)
```

### Parameters

```typescript
interface IReactiveModelOptions<T> {
  properties?: EntityProperty<T>[];  // Array of reactive properties
  computed?: ComputedProperty<T>[];  // Computed properties
  ...initialValues                    // Initial values for properties
}
```

-   `properties`: Array of property names or descriptors of nested reactive objects
-   `computed`: Array of computed property definitions (see Computed Properties section)
-   `initialValues`: Any additional property passed will be used as initial value

### Basic Example

```typescript
import { ReactiveModel } from 'reactive/model';

interface IUser {
	id: string;
	name: string;
	email: string;
}

class User extends ReactiveModel<IUser> {
	declare id: string;
	declare name: string;
	declare email: string;

	constructor(specs: Partial<IUser> = {}) {
		super({
			properties: ['id', 'name', 'email'],
			...specs,
		});
	}
}

const user = new User({ id: '1', name: 'John', email: 'john@example.com' });
```

## 🔑 Main Properties

### State Properties

| Property       | Type         | Description                                               |
| -------------- | ------------ | --------------------------------------------------------- |
| `fetching`     | `boolean`    | Indicates if a load operation is in progress             |
| `loaded`       | `boolean`    | `true` once data is completely loaded                    |
| `ready`        | `boolean`    | Emits `"ready"` when set to `true`                       |
| `processing`   | `boolean`    | `true` if a process is in progress                        |
| `processed`    | `boolean`    | `true` when a process completes                           |
| `isDraft`      | `boolean`    | `true` if no initial values were provided                |
| `initialValues`| `Partial<T>` | Snapshot of values at initialization                     |
| `unpublished`  | `boolean`    | `true` if current state differs from initial              |
| `isReactive`   | `boolean`    | Always `true` (type identifier)                          |
| `propertyNames`| `Set`        | Set of reactive property names                           |

## ⚙️ Main Methods

### `set(properties: Partial<T>): SetPropertiesResult`

Updates one or more reactive properties. Automatically validates against the schema if defined.

**Parameters:**

-   `properties`: Partial object with properties to update

**Returns:**

```typescript
{
  updated: boolean;                    // true if at least one property was updated
  errors?: PropertyValidationErrors<T>; // Validation errors if any
}
```

**Behavior:**

-   Validates each property against the schema (if exists)
-   For properties that are `ReactiveModel` instances, calls their `set()` method or `setItems()` if it's a Collection
-   Triggers `"<property>.changed"` events for each updated property
-   Triggers `"change"` and `"set.executed"` events if at least one property was updated

**Example:**

```typescript
const result = user.set({ name: 'John Doe', email: 'john.doe@example.com' });

if (result.updated) {
	console.log('User updated');
}

if (result.errors) {
	console.log('Validation errors:', result.errors);
}
```

### `getProperty<K extends keyof T>(key: K): T[K]`

Returns the current value of a specific reactive property. **Use this method only when you need dynamic property access** (when the property name comes from a variable). For normal access, use direct property access instead.

**Parameters:**

-   `key`: Property name (type-safe)

**Returns:**

-   The property value

**Alias:**

-   `property` is an alias of `getProperty`

**When to use:**

-   ✅ **Use direct access** (`user.name`) when you know the property name at compile time (recommended)
-   ✅ **Use `getProperty()`** when the property name comes from a variable or is determined dynamically

**Example:**

```typescript
// ✅ Recommended: Direct access (clearer and more idiomatic)
const name = user.name;
const email = user.email;

// ✅ Use getProperty() for dynamic access
const propName = 'name'; // Property name from variable
const value = user.getProperty(propName);

// ✅ Or when iterating over property names
for (const prop of ['name', 'email']) {
  const value = user.getProperty(prop as keyof User);
}
```

### `getProperties(): Partial<T>`

Returns a flat object with current values of all defined reactive properties.

**Special behavior:**

-   For properties that are `ReactiveModel` instances, calls their `getProperties()` method
-   For Collections, returns `getItemProperties()` (array of items instead of Collection instance)

### `validate(properties: Partial<T>): { valid: boolean; errors: PropertyValidationErrors<T> }`

Executes validation against the schema (if defined) and returns the result.

**Parameters:**

-   `properties`: Properties to validate

**Returns:**

```typescript
{
	valid: boolean; // true if all properties are valid
	errors: PropertyValidationErrors<T>; // Validation errors by property
}
```

### `revert(): void`

Restores all model properties to their initial values (`initialValues`).

### `saveChanges(): void`

Saves the current state as the new `initialValues`, clearing draft/unpublished state.

## 🔄 Events

`ReactiveModel` extends `@beyond-js/events`. Events can be subscribed using `on` and triggered with `trigger`.

### Available Events

| Event         | Triggers when                              | Event data      |
| ------------- | ------------------------------------------ | --------------- |
| `change`      | Any reactive property changes              | -               |
| `<prop>.changed` | A specific property is updated         | `{ value, previous }` |
| `ready`       | The `ready` property is set to `true`     | -               |
| `set.executed`| After successful updates via `set()`      | -               |

### Event Usage Example

```typescript
// Listen to changes in any property
user.on('change', () => {
	console.log('User changed:', user.getProperties());
});

// Listen to changes in a specific property
user.on('name.changed', ({ value, previous }) => {
	console.log(`Name changed from "${previous}" to "${value}"`);
});

// Listen when model is ready
user.on('ready', () => {
	console.log('User ready');
});
```

## 🧪 Zod Validation

ReactiveModel has **native Zod integration** for property validation. This allows defining robust validation schemas and getting detailed error messages.

### How It Works

Zod validation works through a **`schema` getter** that you must define in your class. This getter must return a `ZodObject` that defines validation rules for each property.

### Define a Schema

Define the schema using a **`schema` getter** (not a normal property):

```typescript
import { z } from 'zod';
import { ReactiveModel } from 'reactive/model';

interface IUser {
	id: string;
	name: string;
	email: string;
	age?: number;
}

class User extends ReactiveModel<IUser> {
	declare id: string;
	declare name: string;
	declare email: string;
	declare age?: number;

	// ⚠️ IMPORTANT: Must be a getter, not a property
	protected get schema() {
		return z.object({
			id: z.string().min(1, 'ID is required'),
			name: z.string().min(2, 'Name must have at least 2 characters'),
			email: z.string().email('Invalid email'),
			age: z.number().min(0).max(150).optional(),
		});
	}

	constructor(specs: Partial<IUser> = {}) {
		super({
			properties: ['id', 'name', 'email', 'age'],
			...specs,
		});
	}
}
```

**⚠️ Important note:** The schema must be a **getter** (`get schema()`), not a property (`schema = ...`). This allows the schema to be evaluated when needed.

### Automatic Validation

When you define a schema, validation is applied **automatically** when using `set()`:

```typescript
const user = new User();

// This will automatically validate against the schema
const result = user.set({
	name: 'J', // ❌ Error: must have at least 2 characters
	email: 'invalid', // ❌ Error: must be a valid email
});

if (result.errors) {
	// result.errors contains validation errors by property
	console.log('Validation errors:', result.errors);

	// Example of accessing specific errors
	if (result.errors.name) {
		console.log('Error in name:', result.errors.name.error);
	}
}
```

**Behavior:**

-   If validation fails, properties **are not updated**
-   Errors are returned in `result.errors`
-   You can check `result.updated` to know if there were updates

### Manual Validation

You can also validate without updating using the `validate()` method:

```typescript
const user = new User();

// Validate without updating
const validation = user.validate({
	name: 'J',
	email: 'invalid-email',
});

if (!validation.valid) {
	// Handle errors
	Object.entries(validation.errors).forEach(([prop, error]) => {
		console.log(`Error in ${prop}:`, error.error);
	});
}
```

## 🧩 Reactive Properties

### Simple Properties

Simple properties are defined as strings in the `properties` array:

```typescript
class User extends ReactiveModel<IUser> {
	constructor() {
		super({
			properties: ['id', 'name', 'email'],
		});
	}
}
```

### Nested Properties (Reactive Objects)

You can define properties that are other instances of `ReactiveModel`, `Item`, or `Collection`:

```typescript
class User extends ReactiveModel<IUser> {
	constructor() {
		super({
			properties: [
				'id',
				'name',
				{
					name: 'profile',
					value: Profile, // Class that extends ReactiveModel
					properties: ['id', 'bio', 'avatar'],
				},
				{
					name: 'posts',
					value: Collection, // Collection
				},
			],
		});
	}
}
```

For more details on nested properties, see the [nested properties documentation](../entities/nested-properties.md).

## 📊 State Management

### Unpublished State

The `unpublished` property indicates if the model has been modified from its initial state:

```typescript
const user = new User({ id: '1', name: 'John' });
console.log(user.unpublished); // false

user.set({ name: 'John Doe' });
console.log(user.unpublished); // true

user.saveChanges();
console.log(user.unpublished); // false
```

The `unpublished` calculation considers:

-   Primitive properties: direct comparison
-   Arrays: length and content comparison
-   Objects: JSON comparison
-   Nested reactive objects: checks their `unpublished` property

### Draft State

A model is a draft if no initial values were provided:

```typescript
const user1 = new User(); // isDraft = true
const user2 = new User({ id: '1', name: 'John' }); // isDraft = false
```

## 🧮 Computed Properties

Computed properties are derived values that automatically recalculate when their dependencies change. They are read-only and cached until a dependency is modified.

### Defining Computed Properties

```typescript
interface IOrder {
  items: Array<{ price: number; quantity: number }>;
  discount: number;
  total?: number; // Computed
}

class Order extends ReactiveModel<IOrder> {
  declare items: Array<{ price: number; quantity: number }>;
  declare discount: number;

  constructor(specs: Partial<IOrder> = {}) {
    super({
      properties: ['items', 'discount'],
      computed: [
        {
          name: 'total',
          dependencies: ['items', 'discount'],
          compute: (self) => {
            const order = self as Order;
            const subtotal = (order.items || []).reduce(
              (sum, item) => sum + item.price * item.quantity,
              0
            );
            return subtotal - (order.discount || 0);
          },
        },
      ],
      ...specs,
    });
  }
}

// Usage
const order = new Order({
  items: [{ price: 10, quantity: 2 }],
  discount: 5,
});

console.log(order.total); // 15 (10*2 - 5)

order.set({ discount: 10 });
console.log(order.total); // 10 (automatically recalculated)
```

### Computed Property Events

When a dependency changes, the computed property emits a `<name>.changed` event:

```typescript
order.on('total.changed', ({ value, previous }) => {
  console.log(`Total changed from ${previous} to ${value}`);
});

order.set({ discount: 0 }); // Triggers 'total.changed'
```

## 🔄 Transactions

Transactions allow you to batch multiple changes and emit only one `change` event at the end. This is useful when making related changes that should be atomic.

### Using Transactions

```typescript
const user = new User({
  id: '1',
  name: 'John',
  email: 'john@old.com',
  age: 25,
});

// Without transaction: 3 change events
user.set({ name: 'John Doe' });
user.set({ email: 'john@new.com' });
user.set({ age: 26 });

// With transaction: 1 change event
user.transaction(() => {
  user.set({ name: 'John Doe' });
  user.set({ email: 'john@new.com' });
  user.set({ age: 26 });
});
```

### Transaction Return Value

The `transaction()` method returns the result of applying all accumulated changes:

```typescript
const result = user.transaction(() => {
  user.set({ name: 'Updated Name' });
  user.set({ email: 'updated@email.com' });
});

console.log(result.updated); // true if any property changed
```

## 🪝 Lifecycle Hooks

ReactiveModel supports lifecycle hooks that can be overridden in subclasses to intercept operations.

### Available Hooks

| Hook | When it runs | Can modify |
|------|--------------|------------|
| `beforeSet(properties)` | Before `setAsync()` applies changes | Properties to set |
| `afterSet(properties, result)` | After `setAsync()` completes | - |

### Using Hooks

```typescript
class AuditedModel extends ReactiveModel<IData> {
  protected async beforeSet(properties: Partial<IData>): Promise<Partial<IData>> {
    // Add timestamp to every update
    return { ...properties, updatedAt: Date.now() };
  }

  protected async afterSet(
    properties: Partial<IData>,
    result: SetPropertiesResult
  ): Promise<void> {
    if (result.updated) {
      console.log('Model updated:', properties);
    }
  }
}
```

### Async Set

Use `setAsync()` when you need hooks to execute:

```typescript
// Synchronous - hooks NOT called
model.set({ name: 'Test' });

// Async - hooks ARE called
await model.setAsync({ name: 'Test' });
```

## 🔌 Plugin System

ReactiveModel includes a plugin system for extending behavior globally. See the [Plugins documentation](../advanced/plugins.md) for details.

```typescript
import { PluginManager, IReactivePlugin } from 'reactive/model';

const loggingPlugin: IReactivePlugin = {
  name: 'logging',
  onBeforeSet: (model, properties) => {
    console.log('Setting:', properties);
    return properties;
  },
};

PluginManager.register(loggingPlugin);
```

## 🎓 Best Practices

1. **Use TypeScript**: Declare properties for autocomplete and type checking
2. **Define properties explicitly**: Always define the `properties` array
3. **Use set() for updates**: Use `set()` instead of direct assignment for validation and events
4. **Handle validation errors**: Always check errors when using `set()`
5. **Use getProperties() for serialization**: Use `getProperties()` when you need to serialize the model
6. **Listen to events appropriately**: Listen to specific events when possible instead of just `change`
7. **Use transactions for batched updates**: Group related changes to avoid multiple events
8. **Use computed properties for derived values**: Don't store calculated values as regular properties

---

This documentation provides a complete guide for working with `ReactiveModel`. For specific cases of `Item` and `Collection`, see their respective documentation.

