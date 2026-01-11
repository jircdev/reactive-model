# @beyond-js/reactive

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Browser](https://img.shields.io/badge/Browser-4285F4.svg?style=for-the-badge&logo=GoogleChrome&logoColor=white)

**The Data Intelligence Layer for Modern Applications.** 🚀

`@beyond-js/reactive` is a powerful TypeScript library that centralizes business logic, validation, and reactivity within your data structures. It provides a dedicated layer that handles the "truth" of your application, leaving UI frameworks to focus purely on presentation.

---

## ✨ Key Benefits

-   **🎯 Data-First Design**: Business logic belongs to your data, not your UI components.
-   **🤖 AI-Ready**: Highly structured models that AI agents (Cursor, Copilot) can reason about with zero effort.
-   **🔌 Framework Agnostic**: Works perfectly with React, Vue, Svelte, or Node.js.
-   **🤝 Complements UI State Managers**: Co-exists seamlessly with **Zustand**, Redux, or Pinia.
-   **✅ Zod Integration**: Native validation for robust data integrity.

---

## 📚 Documentation

-   **[English Documentation](./docs/en/README.md)**
-   **[Documentación en Español](./docs/es/README.md)**

### Quick Navigation (EN)
- [Philosophy & Vision](./docs/en/philosophy.md) | [Getting Started](./docs/en/getting-started.md)
- [Integration with React & Zustand](./docs/en/architecture/integration-guide.md)
- [ReactiveModel](./docs/en/fundamentals/reactive-model.md) | [Items](./docs/en/entities/items.md) | [Collections](./docs/en/entities/collections.md)
- [ReactiveMap](./docs/en/structures/reactive-map.md) | [ReactiveArray](./docs/en/structures/reactive-array.md) | [ReactiveTree](./docs/en/structures/reactive-tree.md)

---

## 🚀 Quick Start

```bash
npm install @beyond-js/reactive zod
```

```typescript
import { ReactiveModel } from '@beyond-js/reactive/model';

class User extends ReactiveModel<IUser> {
  declare name: string;
  constructor(data) {
    super({ properties: ['name'], ...data });
  }
}

const user = new User({ name: 'John' });
user.on('change', () => updateUI());
user.name = 'Jane'; // Triggers reactivity
```

---

## 📄 License
MIT © @beyond-js
