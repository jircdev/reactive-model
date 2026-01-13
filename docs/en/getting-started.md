# Getting Started

Get up and running with `reactive` in less than 2 minutes.

## 1. Installation

Install the package and its peer dependency `zod`:

```bash
npm install reactive zod
```

## 2. Your First Reactive Model

The `ReactiveModel` is the base class for creating reactive objects with validation.

```typescript
import { ReactiveModel } from 'reactive/model';
import { z } from 'zod';

interface IUser {
  name: string;
  age: number;
}

class User extends ReactiveModel<IUser> {
  // Use 'declare' for type-safe properties
  declare name: string;
  declare age: number;

  constructor(data: Partial<IUser> = {}) {
    super({
      // Define which properties are reactive
      properties: ['name', 'age'],
      ...data
    });

    // Optional: Define a validation schema
    this.schema = z.object({
      name: z.string().min(2),
      age: z.number().min(18)
    });
  }
}
```

## 3. Usage

```typescript
const user = new User({ name: 'John', age: 25 });

// 1. Listen to specific changes
user.on('name.changed', ({ value, previous }) => {
  console.log(`Name changed from ${previous} to ${value}`);
});

// 2. Global change event
user.on('change', () => {
  console.log('User model was updated');
});

// 3. Update properties
user.name = 'Jane'; // Triggers events

// 4. Batch updates with validation
const result = user.set({ name: 'J', age: 10 });
if (!result.valid) {
  console.log('Errors:', result.errors);
}
```

## Next Steps

-   **[Learn about Items](./entities/item.md)**: Manage individual entities with IDs and persistence.
-   **[Explore Collections](./entities/collection.md)**: Manage groups of items with filtering and pagination.
-   **[Reactive Structures](./structures/reactive-map.md)**: Use ReactiveMap, ReactiveArray, or ReactiveTree for specialized data.
