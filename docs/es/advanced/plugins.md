# Sistema de Plugins

El Sistema de Plugins te permite extender el comportamiento de ReactiveModel sin modificar el código principal. Los plugins pueden interceptar operaciones del ciclo de vida (load, publish, delete) para agregar funcionalidad como caché, logging, persistencia o sincronización.

## Uso Básico

### Creando un Plugin

```typescript
import { IReactivePlugin, PluginManager } from 'reactive/model';

const loggingPlugin: IReactivePlugin = {
  name: 'logging',
  priority: 100, // Mayor prioridad = ejecuta primero

  onBeforeLoad: async (item, args) => {
    console.log('Cargando:', args);
    return args;
  },

  onAfterLoad: async (item, data) => {
    console.log('Cargado:', data);
    return data;
  },
};

// Registrar el plugin globalmente
PluginManager.register(loggingPlugin);
```

### Registrando Plugins

```typescript
// Registrar globalmente (todas las entidades)
PluginManager.register(myPlugin);

// Registrar solo para entidades específicas
PluginManager.register(myPlugin, { 
  entities: ['users', 'products'] 
});

// Desregistrar un plugin
PluginManager.unregister('my-plugin');

// Limpiar todos los plugins
PluginManager.clear();
```

## Interface del Plugin

```typescript
interface IReactivePlugin<T = unknown> {
  name: string;           // Identificador único
  priority?: number;      // Mayor = ejecuta primero. Default: 0

  // Hooks de Item
  onBeforeLoad?(item, args): Promise<args>;
  onAfterLoad?(item, data): Promise<data>;
  onBeforePublish?(item, data): Promise<data>;
  onAfterPublish?(item, data): Promise<void>;
  onBeforeDelete?(item, id): Promise<boolean>;
  onAfterDelete?(item, id): Promise<void>;

  // Hooks de Collection
  onBeforeList?(collection, specs): Promise<specs>;
  onAfterList?(collection, items): Promise<items>;
}
```

## Patrones Comunes

### Plugin de Caché

```typescript
const cachePlugin: IReactivePlugin = {
  name: 'cache',
  priority: 200,
  _cache: new Map(),

  onAfterLoad: async function(item, data) {
    const key = `${item.entity}:${data.id}`;
    this._cache.set(key, { data, timestamp: Date.now() });
    return data;
  },
};
```

### Plugin de IndexedDB (Navegador)

```typescript
const indexedDBPlugin: IReactivePlugin = {
  name: 'indexeddb',
  priority: 150,
  // Implementación para persistencia local
};
```

### Plugin de Sincronización Offline

```typescript
const offlineSyncPlugin: IReactivePlugin = {
  name: 'offline-sync',
  priority: 300,
  // Cola de operaciones cuando está offline
  // Sincroniza cuando vuelve a estar online
};
```

## Orden de Ejecución

Los plugins se ejecutan en orden de prioridad (mayor primero):

```
Prioridad 300: offline-sync    (intercepta red)
Prioridad 200: cache           (verifica caché)
Prioridad 150: indexeddb       (verifica almacenamiento)
Prioridad 100: logging         (registra operaciones)
```

Para más detalles, consulta la [documentación en inglés](../en/plugins.md).
