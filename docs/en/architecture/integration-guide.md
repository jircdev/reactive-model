# Integration Guide: React & Zustand

`@beyond-js/reactive` is framework-agnostic. It doesn't replace your UI state management tools like Zustand, Redux, or React Context; it complements them by providing a robust layer for **Domain Logic and Data Intelligence**.

## The Separation of Concerns

To build scalable applications, we recommend separating **UI State** from **Domain Data**:

| Layer | Responsibility | Recommended Tool |
|-------|----------------|------------------|
| **UI State** | Modals, tabs, search filters, loading states, theme. | Zustand, Redux, `useState`. |
| **Domain Data** | Business logic, validation, relationships, persistence. | `@beyond-js/reactive` (Items, Collections). |

---

## Integration with Zustand

Zustand is excellent for global state access. You can store your Reactive Model instances directly inside a Zustand store.

### 1. Define your Reactive Model

```typescript
import { Item } from '@beyond-js/reactive/entities/item';

export class UserProfile extends Item<IUser> {
  constructor() {
    super({
      entity: 'users',
      properties: ['name', 'email', 'avatar'],
      // ...
    });
  }
}
```

### 2. Create a Zustand Store

```typescript
import { create } from 'zustand';
import { UserProfile } from './models/user';

interface AuthStore {
  user: UserProfile | null;
  login: (data: any) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  login: (data) => set({ user: new UserProfile(data) }),
  logout: () => set({ user: null }),
}));
```

---

## Using in React Components

Since `ReactiveModel` uses an event-based system, you can subscribe to changes in your components.

### Custom Hook for Subscription

We recommend a simple hook to force a re-render when the model changes:

```typescript
import { useEffect, useState } from 'react';

export function useReactiveModel(model) {
  const [, setTick] = useState(0);

  useEffect(() => {
    if (!model) return;
    
    const handler = () => setTick(t => t + 1);
    model.on('change', handler);
    
    return () => model.off('change', handler);
  }, [model]);

  return model;
}
```

### Component Implementation

```tsx
function ProfileHeader() {
  const user = useAuthStore(state => state.user);
  useReactiveModel(user); // Re-renders when user.name or any reactive property changes

  if (!user) return null;

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <input 
        value={user.name} 
        onChange={e => user.name = e.target.value} 
      />
      <button onClick={() => user.publish()}>Save</button>
    </div>
  );
}
```

## Benefits of this Pattern

1.  **Framework Agnostic logic**: Your business logic (validation, API calls) is in the `UserProfile` class, which can be used in Node.js or other frameworks without change.
2.  **Clear Intent**: The component only cares about "using" the data. The "how" (saving, validating) is hidden in the model.
3.  **Performance**: You can listen to specific property changes (e.g., `user.on('avatar.changed', ...)`) for even more granular control.
4.  **AI Friendly**: An AI agent can easily generate a new UI for your `UserProfile` because the model defines exactly what is possible and valid.
