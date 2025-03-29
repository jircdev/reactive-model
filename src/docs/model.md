# Model

The `Model<T>` class is a foundational building block for defining reactive entities within the ReactiveModel library.
It provides a structured way to declare reactive properties, manage validation, handle lifecycle states, and work with
event-driven behavior.

This class is intended to be extended to define domain-specific data models, such as users, products, or configuration
objects.

---

## 📦 Basic Usage

```ts
import { Model } from '@beyond-js/reactive/model';

interface IUser {
	id: string;
	name: string;
}

class User extends Model<IUser> {
	declare id: string;
	declare name: string;

	constructor() {
		super({ properties: ['id', 'name'] });
	}
}

const user = new User();

user.on('change', () => {
	console.log('User changed:', user.getProperties());
});

user.id = '1';
user.name = 'Alice';
```

---

## 🧱 Constructor

```ts
new Model(options?: IReactiveModelOptions<T>)
```

### Parameters

-   `properties`: An array of property names or descriptors to be made reactive.
-   Additional key-value pairs can be passed to initialize values.

---

## 🛠️ Key Methods

### `set(properties: Partial<T>): { updated: boolean; errors?: PropertyValidationErrors<T> }`

Updates one or more reactive properties. Automatically validates against the schema if defined.

-   Triggers `"change"` and `"set.executed"` events if at least one property is updated.
-   Returns an object indicating whether any update occurred and any validation errors.

```ts
user.set({ name: 'Alice' });
```

---

### `getProperty<K>(key: K): T[K]`

Returns the current value of a given reactive property.

### `property` _(alias of `getProperty`)_

```ts
user.getProperty('name'); // 'Alice'
user.property('name'); // 'Alice'
```

---

### `setProperty(key: string, value: any): void`

Directly updates a specific reactive property without validation.

---

### `getProperties(): Partial<T>`

Returns a plain object with the current values of all defined reactive properties.

---

### `validate(props: Partial<T>)`

Runs validation against the schema (if defined) and returns `{ valid, errors }`.

---

### `revert()`

Restores the model's state to its `initialValues`.

---

### `saveChanges()`

Saves the current values as the new `initialValues`, clearing the draft/unpublished state.

---

## 📡 Events

The `Model` extends from `@beyond-js/events`. Events can be subscribed using `on` and dispatched with `trigger`.

### Event Types

-   `change`: Fired when any reactive property changes
-   `<property>.changed`: Fired when a specific property is updated
-   `ready`: Fired when the model’s `ready` flag is set to `true`
-   `set.executed`: Fired after successful property updates via `set()`

```ts
user.on('name.changed', ({ value, previous }) => {
	console.log('Name updated from', previous, 'to', value);
});
```

---

## 🔄 State Properties

| Property        | Description                                |
| --------------- | ------------------------------------------ |
| `fetching`      | Indicates ongoing loading or remote ops    |
| `loaded`        | True once data is fully loaded             |
| `ready`         | Emits `"ready"` when set to true           |
| `processing`    | True if a process is ongoing               |
| `processed`     | Set to true when a process completes       |
| `isDraft`       | True if no initial values were provided    |
| `initialValues` | Snapshot of values at initialization       |
| `unpublished`   | True if current state differs from initial |

---

## 🧪 Schema Support

If a `schema` getter is defined returning a `z.object(...)`, validation is applied during `set()` and manual validation.

```ts
get schema() {
	return z.object({
		id: z.string(),
		name: z.string()
	});
}
```

---

## 🧩 Nested Models Example

```ts
class Profile extends Model<{ bio: string }> {
	declare bio: string;
	constructor() {
		super({ properties: ['bio'] });
	}
}

class User extends Model<{ id: string; profile: Profile }> {
	declare id: string;
	declare profile: Profile;

	constructor() {
		super({
			properties: ['id', { name: 'profile', value: Profile, properties: ['bio'] }],
		});
	}
}
```

```

```
