````markdown
# ReactiveModel

**ReactiveModel** is a lightweight reactive state management system built for modular, universal JavaScript and
TypeScript applications within the [BeyondJS](https://beyondjs.com) ecosystem. It enables reactive, event-driven
development through simple and scalable entity definitions.

---

## ✨ Features

-   ✅ Reactive data with automatic state tracking
-   📡 Event-driven architecture using custom event emitters
-   🧩 Composable entities for scalable state modeling
-   🔍 Schema validation powered by `zod`
-   🌐 Designed for universal (client and server) environments

---

## 📦 Dependencies

| Package                                                                | Description                              |
| ---------------------------------------------------------------------- | ---------------------------------------- |
| [`zod`](https://github.com/colinhacks/zod)                             | Runtime schema validation                |
| [`@beyond-js/events`](https://www.npmjs.com/package/@beyond-js/events) | Lightweight event emitter for reactivity |

---

## 🧱 Core Entities

ReactiveModel provides a structured system based on three main concepts:

### • `Model`

A generalized abstraction that can combine items and collections. Useful for defining reactive application models and
orchestrating multiple state sources.

### • `Item`

Represents a reactive unit of data, typically an individual entity such as a user or product. It encapsulates its state,
schema validation, and lifecycle events.

### • `Collection`

Manages a group of reactive items. Offers utilities for adding, removing, updating, and observing changes across the
entire collection.

> Each of these entities is defined in its own module and includes a dedicated `README.md` with full usage and API
> documentation.

## Basic Example of use

### Creating a Model

```ts
import { Model } from '@beyond-js/reactive/model';

interface IUser {
	id: string;
	name: string;
}
class User extends ReactiveModel<IUser> {
	declare id: string;
	declare name: string;
	constructor() {
		super({ properties: ['id', 'name'] }); // it generates the reactive properties.
	}
}
```

---

### Use the model

```ts
const user = new User();
// listen all changes
user.on('change', () => console.log('we listen the change'));
// listen a property change
user.on('name.changed', () => console.log(`the user name property has been changed`, user.name));
```

---

## 📁 Project Structure

```

```
````

/src /entities /item /collection /model

## 📄 License

MIT © BeyondJS

```

```
