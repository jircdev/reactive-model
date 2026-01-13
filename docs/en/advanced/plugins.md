# Plugin System

The Plugin System allows you to extend ReactiveModel's behavior without modifying core code. Plugins can intercept lifecycle operations (load, publish, delete) to add functionality like caching, logging, persistence, or synchronization.

## Overview

```
┌─────────────────────────────────────────────────────────┐
│                      Your Code                          │
│                                                         │
│    item.load()  →  item.publish()  →  item.delete()    │
└────────────┬──────────────┬──────────────┬─────────────┘
             │              │              │
             ▼              ▼              ▼
┌─────────────────────────────────────────────────────────┐
│                    Plugin Manager                        │
│                                                         │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐   │
│  │ Plugin1 │  │ Plugin2 │  │ Plugin3 │  │ Plugin4 │   │
│  │ (cache) │  │ (log)   │  │ (sync)  │  │ (audit) │   │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘   │
│                                                         │
│  Executed in priority order (higher first)              │
└────────────┬──────────────┬──────────────┬─────────────┘
             │              │              │
             ▼              ▼              ▼
┌─────────────────────────────────────────────────────────┐
│                      Provider                            │
│                   (API, Database)                        │
└─────────────────────────────────────────────────────────┘
```

## Basic Usage

### Creating a Plugin

```typescript
import { IReactivePlugin, PluginManager } from 'reactive/model';

const loggingPlugin: IReactivePlugin = {
  name: 'logging',
  priority: 100, // Higher priority = runs first

  onBeforeLoad: async (item, args) => {
    console.log(`[${new Date().toISOString()}] Loading:`, args);
    return args; // Return (modified) args
  },

  onAfterLoad: async (item, data) => {
    console.log(`[${new Date().toISOString()}] Loaded:`, data);
    return data; // Return (modified) data
  },

  onBeforePublish: async (item, data) => {
    console.log(`[${new Date().toISOString()}] Publishing:`, data);
    return data;
  },

  onAfterPublish: async (item, data) => {
    console.log(`[${new Date().toISOString()}] Published:`, data);
  },
};

// Register the plugin globally
PluginManager.register(loggingPlugin);
```

### Registering Plugins

```typescript
// Register globally (all entities)
PluginManager.register(myPlugin);

// Register for specific entities only
PluginManager.register(myPlugin, { 
  entities: ['users', 'products'] 
});

// Unregister a plugin
PluginManager.unregister('my-plugin');

// Clear all plugins
PluginManager.clear();
```

## Plugin Interface

```typescript
interface IReactivePlugin<T = unknown> {
  /** Unique name identifier */
  name: string;
  
  /** Priority (higher = runs first). Default: 0 */
  priority?: number;

  // Item hooks
  onBeforeLoad?(item, args): Promise<args> | args;
  onAfterLoad?(item, data): Promise<data> | data;
  onBeforePublish?(item, data): Promise<data> | data;
  onAfterPublish?(item, data): Promise<void> | void;
  onBeforeDelete?(item, id): Promise<boolean> | boolean;
  onAfterDelete?(item, id): Promise<void> | void;

  // Collection hooks
  onBeforeList?(collection, specs): Promise<specs> | specs;
  onAfterList?(collection, items): Promise<items> | items;

  // ReactiveModel hooks
  onBeforeSet?(model, properties): Promise<properties> | properties;
  onAfterSet?(model, properties, result): Promise<void> | void;

  // Lifecycle
  install?(target): void;
  uninstall?(target): void;
}
```

## Common Plugin Patterns

### Pattern 1: Caching Plugin

```typescript
const cachePlugin: IReactivePlugin = {
  name: 'cache',
  priority: 200, // High priority - runs before other plugins

  // In-memory cache
  _cache: new Map<string, { data: unknown; timestamp: number }>(),
  _ttl: 5 * 60 * 1000, // 5 minutes

  onBeforeLoad: async function(item, args) {
    const key = `${item.entity}:${args?.id || item.id}`;
    const cached = this._cache.get(key);
    
    if (cached && Date.now() - cached.timestamp < this._ttl) {
      // Return cached data by modifying args to skip provider
      item._cachedData = cached.data;
      return { ...args, _useCache: true };
    }
    
    return args;
  },

  onAfterLoad: async function(item, data) {
    const key = `${item.entity}:${data.id}`;
    this._cache.set(key, { data, timestamp: Date.now() });
    return data;
  },

  onAfterPublish: async function(item, data) {
    // Invalidate cache on publish
    const key = `${item.entity}:${data.id}`;
    this._cache.delete(key);
  },

  onAfterDelete: async function(item, id) {
    // Invalidate cache on delete
    const key = `${item.entity}:${id}`;
    this._cache.delete(key);
  },
};
```

### Pattern 2: IndexedDB Persistence Plugin (Browser)

```typescript
const indexedDBPlugin: IReactivePlugin = {
  name: 'indexeddb',
  priority: 150,

  _db: null as IDBDatabase | null,
  _dbName: 'reactive-cache',

  async _getDB(): Promise<IDBDatabase> {
    if (this._db) return this._db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this._dbName, 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this._db = request.result;
        resolve(this._db);
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('items')) {
          db.createObjectStore('items', { keyPath: 'key' });
        }
      };
    });
  },

  onBeforeLoad: async function(item, args) {
    try {
      const db = await this._getDB();
      const key = `${item.entity}:${args?.id || item.id}`;
      
      return new Promise((resolve) => {
        const tx = db.transaction('items', 'readonly');
        const store = tx.objectStore('items');
        const request = store.get(key);
        
        request.onsuccess = () => {
          if (request.result) {
            // Return cached data
            item._cachedData = request.result.data;
          }
          resolve(args);
        };
        
        request.onerror = () => resolve(args);
      });
    } catch {
      return args;
    }
  },

  onAfterLoad: async function(item, data) {
    try {
      const db = await this._getDB();
      const key = `${item.entity}:${data.id}`;
      
      const tx = db.transaction('items', 'readwrite');
      const store = tx.objectStore('items');
      store.put({ key, data, timestamp: Date.now() });
    } catch (e) {
      console.error('IndexedDB save failed:', e);
    }
    
    return data;
  },

  onAfterPublish: async function(item, data) {
    // Update local cache
    try {
      const db = await this._getDB();
      const key = `${item.entity}:${data.id}`;
      
      const tx = db.transaction('items', 'readwrite');
      const store = tx.objectStore('items');
      store.put({ key, data, timestamp: Date.now() });
    } catch (e) {
      console.error('IndexedDB update failed:', e);
    }
  },
};
```

### Pattern 3: Audit Trail Plugin

```typescript
const auditPlugin: IReactivePlugin = {
  name: 'audit',
  priority: 50, // Lower priority - runs after main operations

  async _log(action: string, entity: string, id: string, data?: unknown) {
    await fetch('/api/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action,
        entity,
        id,
        data,
        timestamp: new Date().toISOString(),
        userId: getCurrentUserId(), // Your auth implementation
      }),
    });
  },

  onAfterLoad: async function(item, data) {
    await this._log('READ', item.entity, data.id);
    return data;
  },

  onAfterPublish: async function(item, data) {
    const action = item.isDraft ? 'CREATE' : 'UPDATE';
    await this._log(action, item.entity, data.id, data);
  },

  onAfterDelete: async function(item, id) {
    await this._log('DELETE', item.entity, id);
  },
};
```

### Pattern 4: Offline Sync Plugin

```typescript
interface IPendingOperation {
  id: string;
  entity: string;
  action: 'publish' | 'delete';
  data?: unknown;
  timestamp: number;
}

const offlineSyncPlugin: IReactivePlugin = {
  name: 'offline-sync',
  priority: 300, // Very high - intercepts before network

  _pendingOps: [] as IPendingOperation[],
  _isOnline: navigator.onLine,

  install() {
    window.addEventListener('online', () => this._syncPending());
    window.addEventListener('offline', () => { this._isOnline = false; });
    
    // Load pending ops from localStorage
    const stored = localStorage.getItem('pending-ops');
    if (stored) {
      this._pendingOps = JSON.parse(stored);
    }
  },

  _savePending() {
    localStorage.setItem('pending-ops', JSON.stringify(this._pendingOps));
  },

  async _syncPending() {
    this._isOnline = true;
    
    for (const op of [...this._pendingOps]) {
      try {
        if (op.action === 'publish') {
          await fetch(`/api/${op.entity}/${op.id}`, {
            method: 'PUT',
            body: JSON.stringify(op.data),
          });
        } else if (op.action === 'delete') {
          await fetch(`/api/${op.entity}/${op.id}`, {
            method: 'DELETE',
          });
        }
        
        // Remove from pending
        this._pendingOps = this._pendingOps.filter(p => p.id !== op.id);
        this._savePending();
      } catch (e) {
        console.error('Sync failed for op:', op, e);
      }
    }
  },

  onBeforePublish: async function(item, data) {
    if (!this._isOnline) {
      // Queue for later sync
      this._pendingOps.push({
        id: data.id || crypto.randomUUID(),
        entity: item.entity,
        action: 'publish',
        data,
        timestamp: Date.now(),
      });
      this._savePending();
      
      // Skip provider call by marking as synced locally
      data._offlineQueued = true;
    }
    
    return data;
  },

  onBeforeDelete: async function(item, id) {
    if (!this._isOnline) {
      this._pendingOps.push({
        id,
        entity: item.entity,
        action: 'delete',
        timestamp: Date.now(),
      });
      this._savePending();
      
      // Allow local delete, skip provider
      return true;
    }
    
    return true;
  },
};
```

### Pattern 5: Validation Plugin

```typescript
const validationPlugin: IReactivePlugin = {
  name: 'validation',
  priority: 250, // Before cache/persistence

  _schemas: new Map<string, z.ZodSchema>(),

  registerSchema(entity: string, schema: z.ZodSchema) {
    this._schemas.set(entity, schema);
  },

  onBeforePublish: async function(item, data) {
    const schema = this._schemas.get(item.entity);
    
    if (schema) {
      const result = schema.safeParse(data);
      
      if (!result.success) {
        throw new Error(`Validation failed: ${result.error.message}`);
      }
      
      return result.data; // Return parsed/transformed data
    }
    
    return data;
  },
};

// Usage
validationPlugin.registerSchema('users', z.object({
  name: z.string().min(2),
  email: z.string().email(),
}));

PluginManager.register(validationPlugin);
```

## Mobile App Plugins

For React Native or other mobile frameworks:

### AsyncStorage Plugin (React Native)

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

const asyncStoragePlugin: IReactivePlugin = {
  name: 'async-storage',
  priority: 150,

  onBeforeLoad: async function(item, args) {
    try {
      const key = `@${item.entity}:${args?.id || item.id}`;
      const stored = await AsyncStorage.getItem(key);
      
      if (stored) {
        const parsed = JSON.parse(stored);
        // Check TTL if needed
        item._cachedData = parsed.data;
      }
    } catch (e) {
      console.warn('AsyncStorage read failed:', e);
    }
    
    return args;
  },

  onAfterLoad: async function(item, data) {
    try {
      const key = `@${item.entity}:${data.id}`;
      await AsyncStorage.setItem(key, JSON.stringify({
        data,
        timestamp: Date.now(),
      }));
    } catch (e) {
      console.warn('AsyncStorage write failed:', e);
    }
    
    return data;
  },
};
```

### SQLite Plugin (Mobile)

```typescript
import * as SQLite from 'expo-sqlite';

const sqlitePlugin: IReactivePlugin = {
  name: 'sqlite',
  priority: 150,

  _db: null as SQLite.SQLiteDatabase | null,

  install() {
    this._db = SQLite.openDatabase('reactive-cache.db');
    
    this._db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS items (
          key TEXT PRIMARY KEY,
          data TEXT,
          timestamp INTEGER
        )`
      );
    });
  },

  onAfterLoad: async function(item, data) {
    if (!this._db) return data;
    
    const key = `${item.entity}:${data.id}`;
    
    this._db.transaction(tx => {
      tx.executeSql(
        'INSERT OR REPLACE INTO items (key, data, timestamp) VALUES (?, ?, ?)',
        [key, JSON.stringify(data), Date.now()]
      );
    });
    
    return data;
  },
};
```

## Plugin Execution Order

Plugins execute in priority order (higher priority first):

```
Priority 300: offline-sync    (intercepts network)
Priority 250: validation      (validates data)
Priority 200: cache           (checks memory cache)
Priority 150: indexeddb       (checks persistent cache)
Priority 100: logging         (logs operations)
Priority 50:  audit           (records audit trail)
```

Each plugin can:
1. **Transform data** - Modify args/data passed to next plugin
2. **Short-circuit** - Prevent further execution
3. **Observe** - Just watch without modifying

## Error Handling

Plugins should handle errors gracefully:

```typescript
const safePlugin: IReactivePlugin = {
  name: 'safe-plugin',
  
  onBeforeLoad: async (item, args) => {
    try {
      // Plugin logic
      return modifiedArgs;
    } catch (error) {
      console.error('Plugin error:', error);
      // Return original args to continue chain
      return args;
    }
  },
};
```

The PluginManager catches errors and logs them, allowing the chain to continue:

```typescript
// From PluginManager.runHook
try {
  result = await hook(target, currentValue);
} catch (error) {
  errors.push(error);
  console.error(`Plugin "${plugin.name}" error:`, error);
  // Continue with next plugin
}
```

## Testing Plugins

```typescript
describe('CachePlugin', () => {
  beforeEach(() => {
    PluginManager.clear();
    PluginManager.register(cachePlugin);
  });

  it('should cache loaded data', async () => {
    const item = new TestItem({ id: '1', provider: MockProvider });
    
    // First load - from provider
    await item.load();
    expect(MockProvider.loadCalls).toBe(1);
    
    // Second load - from cache
    await item.load();
    expect(MockProvider.loadCalls).toBe(1); // Still 1
  });

  it('should invalidate cache on publish', async () => {
    const item = new TestItem({ id: '1', provider: MockProvider });
    
    await item.load();
    await item.publish({ name: 'Updated' });
    await item.load();
    
    // Should have loaded twice (cache invalidated)
    expect(MockProvider.loadCalls).toBe(2);
  });
});
```

## Summary

| Plugin Type | Use Case | Priority |
|-------------|----------|----------|
| Offline Sync | Queue operations when offline | 300 |
| Validation | Validate before save | 250 |
| Memory Cache | Fast in-memory caching | 200 |
| IndexedDB | Persistent browser storage | 150 |
| AsyncStorage | React Native storage | 150 |
| SQLite | Mobile database | 150 |
| Logging | Debug/monitor operations | 100 |
| Audit | Compliance tracking | 50 |

The plugin system provides a powerful way to extend ReactiveModel without modifying core code, making it ideal for cross-platform applications with varying storage and sync requirements.
