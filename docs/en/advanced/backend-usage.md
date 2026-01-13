# Backend Usage

ReactiveModel is designed to work seamlessly on both frontend and backend. This guide covers how to use ReactiveModel in Node.js, Bun, Deno, and other server-side environments.

## Why Use ReactiveModel on Backend?

1. **Universal/Isomorphic Code** - Share domain logic between client and server
2. **Event-Driven Architecture** - Built-in pub/sub for reactive backends
3. **Domain-Driven Design** - Items and Collections map naturally to DDD concepts
4. **WebSocket State** - Perfect for managing real-time connection state
5. **In-Memory Caching** - Registry provides Identity Map pattern out of the box

## Basic Setup

### Node.js / Bun

```bash
npm install reactive
```

```typescript
// Import the same way as on frontend
import { ReactiveModel } from 'reactive/model';
import { Item } from 'reactive/entities/item';
import { Collection } from 'reactive/entities/collection';
```

## Universal Code Architecture

The key to universal code is separating the domain logic (shared) from the data access (environment-specific).

### Project Structure

```
/packages
  /core                      # Shared domain logic (universal)
    /entities
      /user
        types.ts             # IUser interface
        item.ts              # User class (no provider hardcoded)
        collection.ts        # Users class
    /services
      user.service.ts        # Business logic
  
  /client                    # Frontend-specific
    /providers
      user.provider.ts       # UserBrowserProvider (fetch API)
    /hooks
      useUser.ts             # React hooks
  
  /server                    # Backend-specific
    /providers
      user.provider.ts       # UserPrismaProvider
    /routes
      user.routes.ts         # API routes
```

### Universal Item (Core)

```typescript
// packages/core/entities/user/item.ts
import { Item } from 'reactive/entities/item';
import type { IUser, IUserProvider } from './types';

export class User extends Item<IUser, IUserProvider> {
  declare id: string;
  declare name: string;
  declare email: string;
  declare role: 'user' | 'admin';

  constructor(specs: Partial<IUser> & { provider?: new (parent: unknown) => IUserProvider } = {}) {
    super({
      entity: 'users',
      properties: ['id', 'name', 'email', 'role'],
      ...specs,
    });
  }

  // Domain logic - works on both client and server
  get isAdmin(): boolean {
    return this.role === 'admin';
  }

  canEdit(resource: { ownerId: string }): boolean {
    return this.isAdmin || resource.ownerId === this.id;
  }

  async promote(): Promise<void> {
    this.set({ role: 'admin' });
    await this.publish();
  }
}
```

### Browser Provider

```typescript
// packages/client/providers/user.provider.ts
import type { IUserProvider, IUser } from '@myapp/core/entities/user';

export class UserBrowserProvider implements IUserProvider {
  async load(id: string): Promise<IUser> {
    const response = await fetch(`/api/users/${id}`);
    return response.json();
  }

  async publish(data: Partial<IUser>): Promise<{ status: number; data: IUser }> {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return { status: 200, data: await response.json() };
  }
}
```

### Server Provider (Prisma)

```typescript
// packages/server/providers/user.provider.ts
import { prisma } from '../db';
import type { IUserProvider, IUser } from '@myapp/core/entities/user';

export class UserPrismaProvider implements IUserProvider {
  async load(id: string): Promise<IUser> {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new Error('User not found');
    return user;
  }

  async publish(data: Partial<IUser>): Promise<{ status: number; data: IUser }> {
    let user: IUser;
    if (data.id) {
      user = await prisma.user.update({
        where: { id: data.id },
        data,
      });
    } else {
      user = await prisma.user.create({ data: data as IUser });
    }
    return { status: 200, data: user };
  }

  async delete(id: string): Promise<boolean> {
    await prisma.user.delete({ where: { id } });
    return true;
  }
}
```

### Usage

```typescript
// Client
import { User } from '@myapp/core/entities/user';
import { UserBrowserProvider } from '@myapp/client/providers/user';

const user = new User({ id: '123', provider: UserBrowserProvider });
await user.load();

// Server
import { User } from '@myapp/core/entities/user';
import { UserPrismaProvider } from '@myapp/server/providers/user';

const user = new User({ id: '123', provider: UserPrismaProvider });
await user.load();

// Same domain logic works on both!
if (user.isAdmin) {
  // ...
}
```

## Backend Use Cases

### Use Case 1: API Controllers

```typescript
// routes/user.routes.ts
import { Router } from 'express';
import { User, Users } from '@myapp/core/entities/user';
import { UserPrismaProvider, UsersPrismaProvider } from '../providers/user';

const router = Router();

router.get('/users', async (req, res) => {
  const users = new Users({ provider: UsersPrismaProvider });
  await users.load({
    where: req.query.status ? { status: { equals: req.query.status } } : undefined,
    limit: parseInt(req.query.limit as string) || 20,
  });
  
  res.json({
    items: users.items.map(u => u.getProperties()),
    total: users.getTotal(),
    next: users.getNext(),
  });
});

router.get('/users/:id', async (req, res) => {
  const user = new User({ id: req.params.id, provider: UserPrismaProvider });
  
  try {
    await user.load();
    res.json(user.getProperties());
  } catch (error) {
    res.status(404).json({ error: 'User not found' });
  }
});

router.post('/users', async (req, res) => {
  const user = new User({ ...req.body, provider: UserPrismaProvider });
  
  const validation = user.validate(req.body);
  if (!validation.valid) {
    return res.status(400).json({ errors: validation.errors });
  }
  
  await user.publish();
  res.status(201).json(user.getProperties());
});

export default router;
```

### Use Case 2: WebSocket State Management

```typescript
// websocket/room.ts
import { ReactiveModel } from 'reactive/model';
import { Collection } from 'reactive/entities/collection';

interface IRoomState {
  id: string;
  name: string;
  participants: string[];
  isLocked: boolean;
}

class Room extends ReactiveModel<IRoomState> {
  declare id: string;
  declare name: string;
  declare participants: string[];
  declare isLocked: boolean;

  constructor(specs: Partial<IRoomState> = {}) {
    super({
      properties: ['id', 'name', 'participants', 'isLocked'],
      ...specs,
    });
  }

  join(userId: string): void {
    if (this.isLocked) {
      throw new Error('Room is locked');
    }
    this.set({ participants: [...this.participants, userId] });
  }

  leave(userId: string): void {
    this.set({
      participants: this.participants.filter(id => id !== userId),
    });
  }
}

// Room manager with reactive state
class RoomManager {
  private rooms = new Map<string, Room>();

  createRoom(id: string, name: string): Room {
    const room = new Room({ id, name, participants: [], isLocked: false });
    
    // Listen to changes and broadcast
    room.on('change', () => {
      this.broadcast(room);
    });
    
    this.rooms.set(id, room);
    return room;
  }

  getRoom(id: string): Room | undefined {
    return this.rooms.get(id);
  }

  private broadcast(room: Room): void {
    // Send to all WebSocket clients in the room
    io.to(room.id).emit('room:update', room.getProperties());
  }
}
```

### Use Case 3: Background Jobs with State

```typescript
// jobs/sync.job.ts
import { ReactiveModel } from 'reactive/model';

interface ISyncJobState {
  id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  totalItems: number;
  processedItems: number;
  error?: string;
}

class SyncJob extends ReactiveModel<ISyncJobState> {
  declare id: string;
  declare status: 'pending' | 'running' | 'completed' | 'failed';
  declare progress: number;
  declare totalItems: number;
  declare processedItems: number;
  declare error?: string;

  constructor(specs: Partial<ISyncJobState> = {}) {
    super({
      properties: ['id', 'status', 'progress', 'totalItems', 'processedItems', 'error'],
      computed: [
        {
          name: 'progress',
          dependencies: ['processedItems', 'totalItems'],
          compute: (self) => {
            const job = self as SyncJob;
            return job.totalItems > 0 ? (job.processedItems / job.totalItems) * 100 : 0;
          },
        },
      ],
      ...specs,
    });
  }

  async run(items: unknown[]): Promise<void> {
    this.set({ status: 'running', totalItems: items.length, processedItems: 0 });

    try {
      for (let i = 0; i < items.length; i++) {
        await this.processItem(items[i]);
        this.set({ processedItems: i + 1 });
        // Progress is computed automatically
      }
      this.set({ status: 'completed' });
    } catch (error) {
      this.set({ status: 'failed', error: error.message });
    }
  }

  private async processItem(item: unknown): Promise<void> {
    // Process logic
  }
}

// Usage with WebSocket for real-time updates
const job = new SyncJob({ id: '123' });

job.on('change', () => {
  // Send progress update to client
  io.emit('job:progress', {
    jobId: job.id,
    progress: job.progress,
    status: job.status,
  });
});

await job.run(items);
```

### Use Case 4: Event Sourcing

```typescript
// events/event-store.ts
import { ReactiveModel } from 'reactive/model';

interface IAggregate {
  id: string;
  version: number;
  events: IEvent[];
}

interface IEvent {
  type: string;
  data: unknown;
  timestamp: number;
}

class Aggregate extends ReactiveModel<IAggregate> {
  declare id: string;
  declare version: number;
  declare events: IEvent[];

  constructor(specs: Partial<IAggregate> = {}) {
    super({
      properties: ['id', 'version', 'events'],
      ...specs,
      events: specs.events || [],
      version: specs.version || 0,
    });
  }

  apply(event: IEvent): void {
    this.transaction(() => {
      this.set({
        events: [...this.events, event],
        version: this.version + 1,
      });
    });
    
    // Emit domain event
    this.trigger(`event:${event.type}`, event.data);
  }

  replay(): void {
    for (const event of this.events) {
      this.trigger(`event:${event.type}`, event.data);
    }
  }
}
```

## Benefits for AI Agents

Using ReactiveModel on backend provides significant advantages for AI-assisted development:

### 1. Predictable Structure

AI agents can understand and generate code following consistent patterns:

```typescript
// AI can reliably generate this pattern
class ${EntityName} extends Item<I${EntityName}, ${EntityName}Provider> {
  // Properties with declare
  // Constructor with entity, provider, properties
  // Domain methods
}
```

### 2. Shared Interfaces

Type definitions are shared, reducing errors:

```typescript
// types.ts - Used by both client and server
export interface IUser {
  id: string;
  name: string;
  email: string;
}
```

### 3. Consistent Validation

Zod schemas work identically on client and server:

```typescript
class User extends Item<IUser> {
  protected get schema() {
    return z.object({
      name: z.string().min(2),
      email: z.string().email(),
    });
  }
}

// Same validation on both environments
const result = user.validate({ name: 'A', email: 'invalid' });
```

### 4. Event-Based Architecture

Easy to understand and extend:

```typescript
// AI can add listeners without modifying core logic
user.on('role.changed', ({ value }) => {
  auditLog.record('Role changed', { userId: user.id, newRole: value });
});
```

## Performance Considerations

### Memory Management

The Registry (Identity Map) caches entities in memory. On backend, you may want to:

```typescript
// Clear registries periodically for long-running processes
import { RegistryFactory } from 'reactive/entities/item';

// Clear all registries
RegistryFactory.clearAll();

// Or clear specific entity
RegistryFactory.clear('users');
```

### Connection Pooling

Providers should use connection pools for databases:

```typescript
import { PrismaClient } from '@prisma/client';

// Single instance for connection pooling
const prisma = new PrismaClient();

class UserPrismaProvider {
  async load(id: string) {
    return prisma.user.findUnique({ where: { id } });
  }
}
```

## Testing Backend Code

```typescript
// user.test.ts
import { User } from '@myapp/core/entities/user';

// Mock provider for testing
class MockUserProvider {
  private data = new Map<string, IUser>();

  async load(id: string): Promise<IUser> {
    const user = this.data.get(id);
    if (!user) throw new Error('Not found');
    return user;
  }

  async publish(data: Partial<IUser>): Promise<{ status: number; data: IUser }> {
    const user = { id: data.id || '1', ...data } as IUser;
    this.data.set(user.id, user);
    return { status: 200, data: user };
  }
}

describe('User', () => {
  it('should promote user to admin', async () => {
    const user = new User({
      id: '1',
      name: 'Test',
      role: 'user',
      provider: MockUserProvider,
    });

    await user.promote();

    expect(user.isAdmin).toBe(true);
    expect(user.role).toBe('admin');
  });
});
```

## Summary

| Aspect | Frontend | Backend |
|--------|----------|---------|
| Domain Logic | Shared (Item, Collection) | Shared (Item, Collection) |
| Providers | Fetch API | Prisma, Mongoose, etc. |
| State | UI stores (Zustand) | In-memory, Redis |
| Events | UI updates | WebSocket, queues |
| Validation | Same (Zod) | Same (Zod) |

ReactiveModel enables true universal code where domain logic is written once and runs everywhere, with environment-specific adapters for data access.
