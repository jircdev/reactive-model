# Items

Los **Items** son clases que extienden `ReactiveModel` y representan entidades individuales dentro de una aplicación reactiva. Cada item representa una entidad identificable (como un usuario, producto, post, etc.) que puede cargarse, guardarse, eliminarse y gestionarse de forma reactiva.

## 🎯 ¿Qué es un Item?

Un `Item` es una clase reactiva que:
- Extiende `ReactiveModel` para obtener capacidades de reactividad
- Se integra con un sistema de registro (registry) para persistir y rastrear su estado
- Puede trabajar con proveedores de datos (providers) para cargar y guardar información
- Gestiona automáticamente su ciclo de vida (carga, publicación, eliminación)

## 🧩 Herencia

```typescript
Item<T, P> extends ReactiveModel<T>
```

- `T`: Interfaz que define las propiedades del item
- `P`: Clase del proveedor que implementa `IEntityProvider`

## 📦 Constructor

```typescript
new Item({
  entity: string,           // Nombre de la entidad (requerido)
  provider?: class,         // Clase del proveedor (opcional)
  properties: string[],     // Array de nombres de propiedades reactivas
  id?: string | number,     // ID inicial del item (opcional)
  ...initialValues          // Valores iniciales adicionales
})
```

### Parámetros

- `entity`: **(requerido)** Nombre de la entidad del dominio (usado para el registro)
- `provider`: **(opcional)** Clase que implementa `IEntityProvider`
- `properties`: Array de nombres de propiedades que serán reactivas
- `id`: ID inicial del item (opcional)
- `initialValues`: Valores iniciales adicionales para las propiedades

## 🔑 Propiedades Principales

| Propiedad          | Tipo       | Descripción                                    |
| ------------------ | ---------- | ---------------------------------------------- |
| `entity`           | `string`   | Nombre de la entidad (ej: `'user'`)           |
| `registry`         | `Registry` | Gestor interno del registro                    |
| `provider`         | `object`   | Instancia del proveedor de datos (opcional)    |
| `fetched`          | `boolean`  | `true` si `load()` fue exitoso                |
| `found`            | `boolean`  | `true` si el registro fue encontrado al cargar |
| `draft`            | `boolean`  | `true` si el item aún es un borrador           |
| `deleted`          | `boolean`  | `true` si el item ha sido eliminado            |
| `__registryState`  | `string`   | Estado del registro: `'draft'`, `'published'` o `'deleted'` |
| `__instanceId`     | `string`   | ID interno de la instancia para rastreo        |

## ⚙️ Métodos Principales

### `load(args?): Promise<any>`

Carga el item utilizando el método `load()` del proveedor asociado. Actualiza el estado interno con los datos obtenidos y emite eventos `"load"` y `"change"`.

**Ejemplo:**

```typescript
const user = new User({ id: '1' });
await user.load();
console.log(user.name); // Nombre cargado desde el proveedor
```

**Parámetros:**
- `args`: Argumentos opcionales que se pasan al proveedor

**Retorna:**
- `Promise<any>`: Los datos cargados del proveedor

**Errores:**
- Lanza un error si el proveedor no está definido o no implementa `load()`
- Lanza un error si el proveedor no retorna un item

### `publish(data?): Promise<T>`

Guarda los cambios del item. Actualiza el estado del registro y llama al método `publish()` del proveedor (si está implementado). Guarda los cambios como `initialValues` internamente.

**Ejemplo:**

```typescript
user.set({ name: 'Juan' });
await user.publish(); // Guarda los cambios
```

**Con datos específicos:**

```typescript
await user.publish({ name: 'Juan', email: 'juan@example.com' });
```

**Parámetros:**
- `data`: Datos opcionales para publicar (si no se proporciona, usa los valores actuales)

**Retorna:**
- `Promise<T>`: Los datos publicados

**Errores:**
- Lanza un error si la publicación falla

### `delete(options?): Promise<boolean>`

Elimina el item mediante el método `delete()` del proveedor y marca el item como eliminado en el registro.

**Ejemplo:**

```typescript
await user.delete(); // Elimina el item
```

**Omitiendo el proveedor:**

```typescript
await user.delete({ skipProvider: true }); // Solo marca como eliminado localmente
```

**Parámetros:**
- `options.skipProvider`: Si es `true`, no llama al proveedor para eliminar

**Retorna:**
- `Promise<boolean>`: `true` si la eliminación fue exitosa

### `set(values: Partial<T>): SetPropertiesResult`

Sobrescribe el método de `Model` para actualizar valores y sincronizarlos con el registro. Dispara el evento `set.executed`.

**Ejemplo:**

```typescript
user.set({ name: 'Pedro', email: 'pedro@example.com' });
```

## 🔄 Eventos

Los items emiten varios eventos que puedes escuchar:

| Evento            | Se dispara cuando                                    |
| ----------------- | ---------------------------------------------------- |
| `set.executed`    | Después de que se llama al método `set()`           |
| `change`          | En cualquier actualización de propiedad              |
| `load`            | Después de un `load()` exitoso                       |
| `<prop>.changed`  | Cuando una propiedad reactiva específica cambia      |

**Ejemplo de uso de eventos:**

```typescript
user.on('change', () => {
  console.log('El item ha cambiado');
});

user.on('name.changed', (value) => {
  console.log(`El nombre cambió a: ${value}`);
});

user.on('load', (data) => {
  console.log('Item cargado:', data);
});
```

## 🛠 Proveedor (Provider)

Para habilitar la carga, publicación o eliminación de datos, debes pasar una clase que implemente `IEntityProvider`:

```typescript
interface IEntityProvider {
  load?(args?: any): Promise<any>;
  publish?(data: any): Promise<{ status: number; data: any }>;
  delete?(id?: string | number): Promise<boolean>;
}
```

### Ejemplo de Proveedor

```typescript
import { IEntityProvider } from 'reactive/entities/item';

export class UserProvider implements IEntityProvider {
  constructor(private parent: any) {}

  async load(args?: { id?: string }): Promise<any> {
    const id = args?.id || this.parent.getProperty('id');
    const response = await fetch(`/api/users/${id}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error('Error al cargar usuario');
    }
    
    return data;
  }

  async publish(data: any): Promise<{ status: number; data: any }> {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Error al guardar usuario');
    }
    
    return { status: 200, data: result };
  }

  async delete(id?: string | number): Promise<boolean> {
    const userId = id || this.parent.getProperty('id');
    const response = await fetch(`/api/users/${userId}`, {
      method: 'DELETE',
    });
    
    return response.ok;
  }
}
```

## 📝 Ejemplo Completo

```typescript
import { Item } from 'reactive/entities/item';
import { UserProvider } from './user-provider';

// Definir la interfaz de datos
interface IUser {
  id: string;
  name: string;
  email: string;
  age?: number;
}

// Crear la clase User
export class User extends Item<IUser, UserProvider> {
  // Declarar propiedades (opcional, ayuda con TypeScript)
  declare id: string;
  declare name: string;
  declare email: string;
  declare age?: number;

  constructor(specs: Partial<IUser> = {}) {
    super({
      entity: 'users',
      provider: UserProvider,
      properties: ['id', 'name', 'email', 'age'],
      ...specs,
    });
  }
}

// Uso del item
async function ejemplo() {
  // Crear un nuevo usuario
  const user = new User({ id: '1' });

  // Escuchar cambios
  user.on('change', () => {
    console.log('Usuario actualizado');
  });

  // Cargar datos
  await user.load();
  console.log(user.name); // Nombre del usuario

  // Actualizar propiedades
  user.set({ name: 'Juan Pérez' });
  user.set({ email: 'juan@example.com' });

  // Guardar cambios
  await user.publish();

  // Eliminar usuario
  await user.delete();
}
```

## 🔍 Características Avanzadas

### Registro (Registry)

Los items se integran automáticamente con un sistema de registro que mantiene el estado de todas las instancias. Esto permite:

- Sincronización entre múltiples instancias del mismo item
- Rastreo del estado (draft, published, deleted)
- Gestión automática de cambios

### Propiedades Reactivas

Solo las propiedades especificadas en el array `properties` son reactivas. Cualquier cambio en estas propiedades:

1. Dispara el evento `<propiedad>.changed`
2. Actualiza el registro automáticamente
3. Dispara el evento `change`

### Estado de Carga

El item mantiene información sobre su estado de carga:

- `fetched`: Indica si se ha intentado cargar el item
- `found`: Indica si el item fue encontrado en la última carga
- `fetching`: Indica si actualmente se está cargando (heredado de `ReactiveModel`)

## 🔗 Propiedades Anidadas

Los Items pueden tener otros Items o Collections como propiedades anidadas. Esto es útil para modelar relaciones entre entidades.

**Ejemplo rápido:**

```typescript
class User extends Item<IUser> {
  constructor(specs = {}) {
    super({
      entity: 'users',
      properties: [
        'id',
        'name',
        {
          name: 'profile',      // Item anidado
          value: Profile,
          properties: ['id', 'bio', 'avatar']
        },
        {
          name: 'posts',        // Collection anidada
          value: Collection,
        }
      ],
      ...specs,
    });
  }
}
```

Para más información sobre cómo implementar propiedades anidadas, consulta la [documentación completa de Propiedades Anidadas](./nested-properties.md).

## 🎓 Mejores Prácticas

1. **Siempre define las propiedades reactivas**: Especifica todas las propiedades que necesitas en el array `properties`

2. **Usa TypeScript**: Define interfaces para tus items para obtener autocompletado y verificación de tipos

3. **Maneja errores**: Siempre envuelve las llamadas a `load()`, `publish()` y `delete()` en try/catch

4. **Escucha eventos**: Usa eventos para reaccionar a cambios sin necesidad de polling

5. **Reutiliza proveedores**: Crea proveedores reutilizables que puedan ser compartidos entre diferentes items similares

## ⚠️ Errores Comunes

### Error: "Entity is required"
```typescript
// ❌ Incorrecto
const user = new User();

// ✅ Correcto
const user = new User({ entity: 'users' }); // O definir entity en el constructor
```

### Error: "Provider must be a class/constructor"
```typescript
// ❌ Incorrecto
super({ provider: new UserProvider() });

// ✅ Correcto
super({ provider: UserProvider });
```

### Error: "DataProvider is not defined or does not implement the load() method"
```typescript
// ❌ Incorrecto - Intentar cargar sin proveedor
const user = new User({ entity: 'users' });
await user.load(); // Error!

// ✅ Correcto - Proporcionar proveedor o verificar antes de cargar
if (user.provider) {
  await user.load();
}
```

