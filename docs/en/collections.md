# Colecciones

Las **Colecciones** son clases que extienden `ReactiveModel` y representan grupos reactivos de items. Permiten cargar, filtrar, ordenar y gestionar múltiples instancias de un `Item` definido, asegurando sincronización con un registro compartido y soporte para actualizaciones dinámicas desde fuentes de datos externas.

## 🎯 ¿Qué es una Colección?

Una `Collection` es una clase reactiva que:
- Gestiona múltiples instancias de un tipo de `Item`
- Carga datos desde proveedores externos
- Filtra y ordena items según criterios específicos
- Soporta paginación automática
- Se sincroniza automáticamente con cambios en el registro
- Agrega nuevos items automáticamente si coinciden con los filtros

## 🧩 Herencia

```typescript
Collection<T, P> extends ReactiveModel<Collection<T, P>>
```

- `T`: Clase del item que extiende `Item<any>`
- `P`: Clase del proveedor que implementa `ICollectionProvider`

## 📦 Constructor

```typescript
new Collection({
  entity: string,              // Nombre de la entidad (requerido)
  provider?: class,            // Clase del proveedor (opcional)
  item: class,                // Clase del item (requerido)
  defaultLimit?: number,       // Límite por defecto para paginación (default: 15)
  nextParamName?: string       // Nombre del parámetro de paginación (default: "next")
})
```

### Parámetros

- `entity`: **(requerido)** Identificador del tipo de colección (ej: `'users'`)
- `provider`: **(opcional)** Clase que implementa `ICollectionProvider`
- `item`: **(requerido)** La clase `Item` a instanciar al cargar datos
- `defaultLimit`: **(opcional)** Número máximo de items a cargar por defecto (por defecto: 15)
- `nextParamName`: **(opcional)** Nombre del parámetro de paginación enviado al proveedor (por defecto: `"next"`)

## 🔑 Propiedades Principales

| Propiedad   | Tipo             | Descripción                                              |
| ----------- | ---------------- | -------------------------------------------------------- |
| `entity`    | `string`         | Nombre de la entidad                                     |
| `provider`  | `P`              | Instancia del proveedor de datos                         |
| `Item`      | `class`          | Clase del item usado en la colección                     |
| `items`     | `T[]`            | Array de items en la colección                           |
| `map`       | `Map<ItemId, T>` | Mapa interno de items indexados por ID                   |
| `isCollection` | `boolean`    | Siempre `true` (identificador de tipo)                   |
| `total`     | `number`         | Total de items disponibles (si lo proporciona el proveedor) |
| `next`      | `unknown \| null` | Valor del cursor de paginación (si existe)               |

## ⚙️ Métodos Principales

### `load(args?): Promise<T[]>`

Carga items desde el proveedor configurado. Si se omite `limit`, se usa el `defaultLimit` de la colección.

La paginación se maneja internamente: si la colección tiene un cursor de paginación ("next"), se agregará automáticamente a la solicitud usando el nombre de parámetro definido por `nextParamName`.

**Ejemplo básico:**

```typescript
const users = new Users();
await users.load();
console.log(users.items); // Array de usuarios
```

**Con filtros:**

```typescript
await users.load({
  where: {
    name: { contains: 'Juan' },
    age: { gte: 18 }
  }
});
```

**Con paginación:**

```typescript
// Primera página
await users.load({ limit: 10 });

// Siguiente página (automática)
await users.load({ limit: 10, update: true }); // Agrega items sin reemplazar
```

**Especificación completa:**

```typescript
await users.load({
  where: {
    name: { contains: 'Juan' },
    age: { gte: 18, lte: 65 }
  },
  orderBy: {
    name: 'asc',
    age: 'desc'
  },
  limit: 20,
  update: true // Para agregar items en lugar de reemplazarlos
});
```

**Parámetros (`ILoadSpecs<T>`):**

- `where`: Objeto con filtros a aplicar
- `orderBy`: Objeto con criterios de ordenamiento
- `limit`: Número máximo de items a cargar
- `update`: Si es `true`, agrega items sin reemplazar los existentes

**Retorna:**
- `Promise<T[]>`: Array de items cargados

**Errores:**
- Lanza un error si el proveedor no está definido o no implementa `list()`
- Lanza un error si `list()` no retorna un array o un objeto con `items`

### Operadores de Filtro

La colección soporta varios operadores para filtrar datos:

| Operador   | Descripción                                      | Ejemplo                          |
| ---------- | ------------------------------------------------ | -------------------------------- |
| `equals`   | Coincidencia exacta                              | `{ name: { equals: 'Juan' } }`  |
| `not`      | Diferente del valor                              | `{ age: { not: 18 } }`          |
| `in`       | El valor está en el array                        | `{ status: { in: ['active', 'pending'] } }` |
| `notIn`    | El valor no está en el array                     | `{ role: { notIn: ['admin'] } }` |
| `contains` | Contiene la subcadena (solo strings)             | `{ name: { contains: 'Juan' } }` |
| `startsWith` | Comienza con (solo strings)                   | `{ email: { startsWith: 'juan' } }` |
| `endsWith` | Termina con (solo strings)                      | `{ email: { endsWith: '.com' } }` |
| `gt`       | Mayor que                                        | `{ age: { gt: 18 } }`            |
| `gte`      | Mayor o igual que                                | `{ age: { gte: 18 } }`           |
| `lt`       | Menor que                                        | `{ age: { lt: 65 } }`            |
| `lte`      | Menor o igual que                                | `{ age: { lte: 65 } }`           |

**Ejemplo con múltiples filtros:**

```typescript
await users.load({
  where: {
    name: { contains: 'Juan' },
    age: { gte: 18, lte: 65 },
    status: { in: ['active', 'pending'] },
    email: { not: null }
  }
});
```

### Operadores Lógicos (AND/OR)

Puedes combinar condiciones usando operadores lógicos:

**AND (todas las condiciones deben cumplirse):**

```typescript
await users.load({
  where: {
    AND: [
      { name: { contains: 'Juan' } },
      { age: { gte: 18 } }
    ]
  }
});
```

**OR (al menos una condición debe cumplirse):**

```typescript
await users.load({
  where: {
    OR: [
      { name: { contains: 'Juan' } },
      { email: { contains: 'juan' } }
    ]
  }
});
```

**Combinando AND y OR:**

```typescript
await users.load({
  where: {
    age: { gte: 18 },
    AND: [
      { name: { contains: 'Juan' } },
      { OR: [
        { status: { equals: 'active' } },
        { status: { equals: 'pending' } }
      ]}
    ]
  }
});
```

### Ordenamiento

Usa `orderBy` para ordenar los resultados:

```typescript
// Ordenar por nombre ascendente
await users.load({
  orderBy: {
    name: 'asc'
  }
});

// Ordenar por múltiples campos
await users.load({
  orderBy: {
    age: 'desc',
    name: 'asc'
  }
});
```

### `getTotal(): number`

Retorna el número total de items disponibles (si fue proporcionado por el proveedor).

```typescript
await users.load();
const total = users.getTotal();
console.log(`Total de usuarios: ${total}`);
```

### `getNext(): unknown | null`

Retorna el valor del cursor de paginación (si existe).

```typescript
await users.load({ limit: 10 });
const nextCursor = users.getNext();
if (nextCursor) {
  // Hay más páginas disponibles
  await users.load({ limit: 10, update: true });
}
```

### `addItems(data: T[]): void`

Agrega items manualmente a la colección sin cargar desde el proveedor.

```typescript
const newUsers = [
  new User({ id: '1', name: 'Juan' }),
  new User({ id: '2', name: 'María' })
];
users.addItems(newUsers);
```

### `delete(ids: ItemId | ItemId[]): Promise<boolean[]>`

Elimina uno o múltiples items de la colección.

```typescript
// Eliminar un item
await users.delete('user-123');

// Eliminar múltiples items
await users.delete(['user-123', 'user-456']);
```

## 🔄 Eventos

Las colecciones emiten varios eventos:

| Evento            | Se dispara cuando                                    |
| ----------------- | ---------------------------------------------------- |
| `load`            | Después de cargar items exitosamente                 |
| `change`          | Cuando la colección cambia                           |
| `items.changed`   | Cuando se agregan, modifican o eliminan items        |

**Ejemplo de uso de eventos:**

```typescript
users.on('load', ({ items, total, next }) => {
  console.log(`Cargados ${items.length} de ${total} usuarios`);
  if (next) {
    console.log('Hay más páginas disponibles');
  }
});

users.on('change', () => {
  console.log('La colección ha cambiado');
});

users.on('items.changed', ({ items }) => {
  console.log('Items actualizados:', items);
});
```

## 🛠 Proveedor (Provider)

Para habilitar la carga de datos, debes pasar una clase que implemente `ICollectionProvider`:

```typescript
interface ICollectionProvider {
  list(specs?: any): Promise<any[] | { items: any[], total?: number, next?: any }>;
  publish?(data: any): Promise<any>;
  remove?(specs?: any): Promise<any>;
}
```

### Ejemplo de Proveedor de Colección

```typescript
import { ICollectionProvider } from '@beyond-js/reactive/entities/collection';

export class UsersProvider implements ICollectionProvider {
  constructor(private parent: any) {}

  async list(args?: any): Promise<{ items: any[], total: number, next?: any }> {
    const params = new URLSearchParams();
    
    if (args?.limit) params.append('limit', args.limit.toString());
    if (args?.next) params.append('next', args.next.toString());
    
    // Enviar filtros (depende de tu API)
    if (args?.where) {
      params.append('filters', JSON.stringify(args.where));
    }
    
    const response = await fetch(`/api/users?${params}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error('Error al cargar usuarios');
    }
    
    // Retornar en formato esperado
    return {
      items: data.items || data,
      total: data.total || data.items?.length || 0,
      next: data.next || null
    };
  }

  async deleteMany(ids: string[]): Promise<boolean> {
    const response = await fetch('/api/users/bulk-delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids }),
    });
    
    return response.ok;
  }
}
```

**Formato de respuesta del proveedor:**

El método `list()` puede retornar:
- Un array directamente: `Promise<any[]>`
- Un objeto con estructura: `Promise<{ items: any[], total?: number, next?: any }>`

## 📝 Ejemplo Completo

```typescript
import { Collection } from '@beyond-js/reactive/entities/collection';
import { User } from './user';
import { UsersProvider } from './users-provider';

// Crear la clase de colección
export class Users extends Collection<User, UsersProvider> {
  constructor() {
    super({
      entity: 'users',
      provider: UsersProvider,
      item: User,
      defaultLimit: 20,
      nextParamName: 'cursor' // Si tu API usa 'cursor' en lugar de 'next'
    });
  }
}

// Uso de la colección
async function ejemplo() {
  const users = new Users();

  // Escuchar eventos
  users.on('load', ({ items, total }) => {
    console.log(`Cargados ${items.length} de ${total} usuarios`);
  });

  users.on('change', () => {
    console.log('Colección actualizada');
  });

  // Cargar usuarios con filtros
  await users.load({
    where: {
      status: { equals: 'active' },
      age: { gte: 18 }
    },
    orderBy: {
      name: 'asc'
    },
    limit: 20
  });

  console.log('Usuarios:', users.items);
  console.log('Total:', users.getTotal());

  // Cargar siguiente página
  if (users.getNext()) {
    await users.load({
      limit: 20,
      update: true // Agrega items sin reemplazar
    });
  }

  // Acceder a un item específico
  const user = users.map.get('user-123');
  if (user) {
    user.set({ name: 'Juan Pérez' });
    await user.publish();
  }

  // Eliminar usuarios
  await users.delete(['user-123', 'user-456']);
}
```

## 🔍 Características Avanzadas

### Sincronización Automática con el Registro

Las colecciones se sincronizan automáticamente con el sistema de registro. Cuando un item se publica o elimina en otra parte de la aplicación:

1. Si el item coincide con los filtros de la colección, se agrega automáticamente
2. Si un item se elimina, se remueve automáticamente de la colección
3. Los cambios en items existentes se reflejan automáticamente

### Paginación Automática

La colección maneja la paginación automáticamente:

- Si el proveedor retorna un cursor `next`, se almacena internamente
- En la próxima llamada a `load()`, se envía automáticamente el cursor
- No necesitas manejar manualmente el parámetro de paginación

### Filtros Persistentes

Los filtros se almacenan internamente y se usan para validar nuevos items del registro. Si un nuevo item coincide con los filtros, se agrega automáticamente a la colección.

## 🔗 Propiedades Anidadas

Las Collections pueden ser usadas como propiedades anidadas en Items u otros ReactiveModels. Esto permite modelar relaciones complejas donde un Item tiene una Collection de items relacionados.

**Ejemplo rápido:**

```typescript
class Post extends Item<IPost> {
  constructor(specs = {}) {
    super({
      entity: 'posts',
      properties: [
        'id',
        'title',
        {
          name: 'comments',  // Collection anidada
          value: Collection,
        }
      ],
      ...specs,
    });

    // Configurar la colección
    if (this.comments) {
      this.comments.item = Comment;
      this.comments.entity = 'comments';
    }
  }
}
```

Para más información sobre cómo implementar propiedades anidadas con Collections, consulta la [documentación completa de Propiedades Anidadas](./nested-properties.md).

## 🎓 Mejores Prácticas

1. **Define un límite por defecto razonable**: Usa `defaultLimit` para evitar cargar demasiados items de una vez

2. **Usa `update: true` para paginación**: Cuando cargas más páginas, usa `update: true` para agregar items sin reemplazar los existentes

3. **Maneja errores**: Siempre envuelve las llamadas a `load()` en try/catch

4. **Optimiza filtros**: Los filtros se evalúan en el proveedor, pero también localmente para nuevos items del registro

5. **Reutiliza colecciones**: Crea instancias de colecciones y reutilízalas en lugar de crear nuevas constantemente

## ⚠️ Errores Comunes

### Error: "DataProvider is not defined or does not implement the list() method"
```typescript
// ❌ Incorrecto
const users = new Users();
await users.load(); // Error si no hay proveedor

// ✅ Correcto
// Define el proveedor en el constructor o verifica antes
if (users.provider) {
  await users.load();
}
```

### Error: "DataProvider.list() must return an array or an object with an 'items' array"
```typescript
// ❌ Incorrecto - Proveedor retorna formato incorrecto
async list() {
  return { data: [...] }; // Error!
}

// ✅ Correcto - Retorna array o objeto con 'items'
async list() {
  return [...]; // O { items: [...], total: 100 }
}
```

### No se cargan más páginas
```typescript
// ❌ Incorrecto - No usar update: true
await users.load({ limit: 10 });
await users.load({ limit: 10 }); // Reemplaza items en lugar de agregar

// ✅ Correcto - Usar update: true para paginación
await users.load({ limit: 10 });
await users.load({ limit: 10, update: true }); // Agrega items
```

