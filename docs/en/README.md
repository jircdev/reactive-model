# @beyond-js/reactive

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Deno JS](https://img.shields.io/badge/deno%20js-000000.svg?style=for-the-badge&logo=deno&logoColor=white)
![Bun](https://img.shields.io/badge/Bun-%23000000.svg?style=for-the-badge&logo=bun&logoColor=white)
![Browser](https://img.shields.io/badge/Browser-4285F4.svg?style=for-the-badge&logo=GoogleChrome&logoColor=white)

`@beyond-js/reactive` is a powerful TypeScript library designed to provide a reactive data layer for your application. By offering tools to create and manage reactive data structures, it enables developers to construct performant and scalable applications with ease. It enhances data-driven views or components by reacting to changes and keeping everything in sync.

This folder contains complete documentation on how the main components of the Reactive Model system work: **ReactiveModel**, **Items**, **Collections**, and **Nested Properties**.

## ✨ Why Reactive Model?

Reactive Model is a library that simplifies reactive data management in JavaScript/TypeScript applications. It offers the following main features:

### 🎯 Simplified Data Management

-   **Items**: Complete lifecycle management of individual entities (load, save, delete)
-   **Collections**: Management of item groups with filtering, sorting, and automatic pagination
-   **Nested Properties**: Model complex relationships between entities naturally

### 📡 Reactive Event System

-   **Property events**: Listen to specific changes (`user.on('name.changed', ...)`)
-   **Global events**: React to any change (`user.on('change', ...)`)
-   **Custom events**: Trigger your own events with `trigger()`
-   **Granular reactivity**: Precise UI updates without unnecessary re-renders

### ✅ Zod Validation

-   **Native integration**: Define Zod schemas using a `schema` getter
-   **Automatic validation**: Validates automatically when updating properties
-   **Manual validation**: Validate data without updating using `validate()`
-   **Custom messages**: Define specific error messages for each rule

### 🔌 Data Source Decoupling

-   **Providers**: Data access logic completely separated from the model
-   **Flexibility**: Works with any source (REST APIs, GraphQL, IndexedDB, localStorage, etc.)
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

## 📚 Index

### Fundamentals

-   [ReactiveModel](./reactive-model.md) - Base class for reactive models
-   [Items](./items.md) - Complete guide on working with individual items
-   [Collections](./collections.md) - Complete guide on working with item collections

### Advanced Topics

-   [Nested Properties](./nested-properties.md) - How to implement Items and Collections as properties
-   [Practical Examples](./examples.md) - Real-world usage examples of items and collections

## 🎯 Key Concepts

### ReactiveModel

**ReactiveModel** is the base class that provides reactive functionality. It allows defining reactive properties, managing validation, handling lifecycle states, and working with events.

### Items

**Items** represent individual reactive entities (such as a user, product, etc.) that can be loaded, saved, and deleted through data providers. They extend `ReactiveModel` and integrate with a registry system.

### Collections

**Collections** represent groups of items that can be loaded, filtered, and managed reactively. They also extend `ReactiveModel` and provide pagination and filtering capabilities.

### Nested Properties

**Nested Properties** allow an Item or ReactiveModel to have other instances of Item or Collection as properties, enabling modeling of complex relationships between entities.

Both concepts are designed to work with **Providers** that handle data access logic (APIs, databases, etc.).

## 🚀 Quick Start

### Basic Item

```typescript
import { Item } from '@beyond-js/reactive/entities/item';

class User extends Item<IUser, UserProvider> {
	constructor() {
		super({
			entity: 'users',
			provider: UserProvider,
			properties: ['id', 'name', 'email'],
		});
	}
}

const user = new User({ id: '1' });
await user.load();

// Direct property access
console.log(user.name, user.email);

// Listen to changes
user.on('name.changed', ({ value }) => {
	console.log('Name changed to:', value);
});

// Destructuring works normally
const { name, email } = user;
```

### Basic Collection

```typescript
import { Collection } from '@beyond-js/reactive/entities/collection';

class Users extends Collection<User, UserProvider> {
	constructor() {
		super({
			entity: 'users',
			provider: UserProvider,
			item: User,
		});
	}
}

const users = new Users();
await users.load();

// Direct access to items
users.items.forEach(user => {
	console.log(user.name);
});

// Filtering and search
await users.load({
	where: {
		name: { contains: 'John' },
		age: { gte: 18 },
	},
});
```

## 📖 More Information

For more details, consult the specific documentation for each component:

### Fundamentals

-   [ReactiveModel - Detailed documentation](./reactive-model.md) - Base class with all its features
-   [Items - Detailed documentation](./items.md) - Individual entity management
-   [Collections - Detailed documentation](./collections.md) - Item group management

### Advanced Topics

-   [Nested Properties - Detailed documentation](./nested-properties.md) - Items and Collections as properties
-   [Practical examples](./examples.md) - Real-world use cases and common patterns

## 🔗 Recommended Reading Order

If you're new to Reactive Model, we recommend reading the documentation in this order:

1. **[ReactiveModel](./reactive-model.md)** - Understand the fundamentals of reactivity
2. **[Items](./items.md)** - Learn to work with individual entities
3. **[Collections](./collections.md)** - Learn to manage item groups
4. **[Nested Properties](./nested-properties.md)** - Model complex relationships
5. **[Practical Examples](./examples.md)** - See real implementation examples

## 📦 Installation

To add `@beyond-js/reactive` to your project, run:

```bash
npm install @beyond-js/reactive
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! We appreciate your interest in improving `@beyond-js/reactive`.

### How to Contribute

1. **Fork the repository** and clone it to your local machine:

```bash
git clone https://github.com/jircdev/reactive-model.git
cd reactive-model
```

2. **Install dependencies**:

```bash
# For the library
npm install

# For tests
cd tests
npm install
```

3. **Create a branch** for your feature or fix:

```bash
git checkout -b feature/my-new-feature
```

4. **Run the development server**:

```bash
beyond run
```

Access the server at `http://localhost:950` to test your changes.

5. **Run tests** to ensure everything works:

```bash
cd tests
npm test
```

6. **Commit** your changes and **submit a Pull Request** with a clear description of the changes.

### Code of Conduct

By participating in this project, you agree to maintain a respectful and welcoming environment for all contributors.

## 📄 License

This project is licensed under the [MIT License](../src/LICENSE).

Copyright (c) @beyond-js

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

