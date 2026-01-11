# @beyond-js/reactive

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Browser](https://img.shields.io/badge/Browser-4285F4.svg?style=for-the-badge&logo=GoogleChrome&logoColor=white)

`@beyond-js/reactive` is a powerful TypeScript library designed to provide a **Data Intelligence Layer** for your
application. By centralizing business logic, validation, and reactivity within your data structures, it enables
developers to build scalable, framework-agnostic applications that are incredibly easy for AI agents to understand and
maintain.

---

## 🧭 Documentation Journey

Choose your path to master `@beyond-js/reactive`:

### 1. Vision and Basics

-   **[Philosophy & Vision](./philosophy.md)**: Why business logic belongs to the data, and how this impacts AI
    development.
-   **[Getting Started](./getting-started.md)**: Install and build your first model in 2 minutes.

### 2. Fundamentals

-   **[ReactiveModel](./fundamentals/reactive-model.md)**: The base class for all reactive objects.
-   **[Interfaces](./fundamentals/interfaces.md)**: Unified contracts for polymorphic handling.

### 3. Domain Entities

-   **[Items](./entities/items.md)**: Managing individual entities with IDs and lifecycle.
-   **[Collections](./entities/collections.md)**: Groups of items with filtering and pagination.
-   **[Nested Properties](./entities/nested-properties.md)**: Modeling complex relationships.

### 4. Reactive Structures

-   **[ReactiveMap](./structures/reactive-map.md)**: Key-value reactive storage.
-   **[ReactiveArray](./structures/reactive-array.md)**: Standard array methods with reactive events.
-   **[ReactiveTree](./structures/reactive-tree.md)**: Hierarchical data management.

### 5. Advanced & Architecture

-   **[Integration Guide (React & Zustand)](./architecture/integration-guide.md)**: How to co-exist with UI state
    managers.
-   **[Providers](./advanced/providers.md)**: Decoupling data access (APIs, Databases).
-   **[Plugins](./advanced/plugins.md)**: Extending functionality with cross-cutting concerns.
-   **[Practical Examples](./advanced/examples.md)**: Real-world implementation scenarios.

---

## ✨ Why Choose This Library?

### 🎯 Data-First Logic

Stop leaking validation and business rules into your React components. Define them once in your models and use them
anywhere (Frontend, Backend, Mobile).

### 🤖 AI-Native Development

AI agents (Cursor, Copilot) perform best when code has explicit structure. This library's use of Zod and encapsulated
logic makes it self-documenting for AI.

### 🔌 Framework Agnostic

Compatible with React, Vue, Svelte, or Node.js. It doesn't replace Zustand or Redux—it handles the data layer while they
handle the UI state.

### ✅ Built-in Intelligence

-   **Zod Validation**: Native schema integration.
-   **Change Tracking**: Automatically detect unpublished changes.
-   **Event System**: Fine-grained reactivity.

---

## 🚀 Quick Start Snippet

```typescript
import { Item } from '@beyond-js/reactive/entities/item';

class Product extends Item<IProduct> {
	constructor(data) {
		super({
			entity: 'products',
			properties: ['name', 'price'],
			...data,
		});
	}
}

const myProduct = new Product({ name: 'Laptop', price: 999 });
myProduct.on('change', () => console.log('Updated!'));
myProduct.name = 'Pro Laptop'; // Triggers event
```

---

## 🤝 Community & Support

-   [CHANGELOG](./CHANGELOG.md)
-   [Migration Guide](./migration-v3.md)
-   [Contributing](../../contributing.md)
