# Providers

Los **Providers** son un concepto clave en el sistema ReactiveModel. Te permiten desacoplar la lógica de acceso a datos
de la capa reactiva. Al implementar una interfaz simple, los providers hacen posible integrar tus modelos y colecciones
con cualquier tipo de fuente de datos — desde almacenamiento local e IndexedDB hasta SQL, NoSQL, APIs REST, o incluso
sistemas de archivos.

---

## 🎯 Propósito

El objetivo principal de un provider es **externalizar la lógica de persistencia** para que la capa reactiva (items y
colecciones) pueda permanecer agnóstica de cómo se obtienen, almacenan o actualizan los datos.

Esto permite:

-   Separación clara de responsabilidades
-   Pruebas y mocks más fáciles
-   Integración plug-and-play con varios backends o motores de almacenamiento
-   Manejo uniforme de fuentes de datos locales y remotas

---

## 🔁 Concepto Compartido

El concepto de provider se usa en ambos:

-   [`Item<T>`](./items.md) — para operaciones de entidad única
-   [`Collection<T>`](./collections.md) — para operaciones de grupo

Aunque ambos dependen de un provider, **cada uno requiere una interfaz diferente**, adecuada a su propósito.

---

## 📦 Providers de Item

Se usan en la clase `Item<T>` para interactuar con una entidad única. Debes implementar la interfaz `IEntityProvider`:

### Interfaz

```ts
export interface IEntityProvider {
	load?(specs?: any): Promise<any>;
	list?(specs?: any): Promise<any>;
	publish?(data: any): Promise<any>;
	remove?(specs: any): Promise<any>;
	delete?(specs?: any): Promise<any>;
	deleteMany?(specs?: any): Promise<any>;
}
```

### Métodos Clave

-   **`load(specs?)`**: **(Opcional)** Obtiene un item por ID u otros criterios. Debe retornar los datos del item
    directamente (no envueltos en un objeto de respuesta).
-   **`publish(data)`**: **(Opcional)** Guarda o actualiza un item. Debe retornar los datos del item actualizado
    directamente.
-   **`delete(specs?)`**: **(Opcional)** Elimina un item. Debe retornar `true` si es exitoso, o lanzar un error si
    falla.

### Ejemplo

```ts
import { IEntityProvider } from '@beyond-js/reactive/entities/item';

interface IUser {
	id: string;
	name: string;
	email: string;
}

export class UserProvider implements IEntityProvider {
	async load(id: string): Promise<IUser> {
		const response = await fetch(`/api/users/${id}`);

		if (!response.ok) {
			throw new Error(`Error al cargar usuario: ${response.statusText}`);
		}

		const result = await response.json();

		// Manejar estructura de respuesta de API si es necesario
		// Retornar solo los datos, no el wrapper de respuesta
		return result.data || result;
	}

	async publish(data: IUser): Promise<IUser> {
		const response = await fetch(`/api/users`, {
			method: data.id ? 'PUT' : 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data),
		});

		if (!response.ok) {
			throw new Error(`Error al publicar usuario: ${response.statusText}`);
		}

		const result = await response.json();
		return result.data || result;
	}

	async delete(id: string): Promise<boolean> {
		const response = await fetch(`/api/users/${id}`, {
			method: 'DELETE',
		});

		if (!response.ok) {
			throw new Error(`Error al eliminar usuario: ${response.statusText}`);
		}

		return true;
	}
}
```

### Uso en Item

```ts
import { Item } from '@beyond-js/reactive/entities/item';
import { UserProvider } from './user-provider';

class User extends Item<IUser, UserProvider> {
	declare id: string;
	declare name: string;
	declare email: string;

	constructor() {
		super({
			entity: 'users',
			provider: UserProvider,
			properties: ['id', 'name', 'email'],
		});
	}
}

// Uso
const user = new User();
await user.load('123'); // Llama a UserProvider.load('123')
await user.publish({ name: 'John' }); // Llama a UserProvider.publish({...})
await user.delete('123'); // Llama a UserProvider.delete('123')
```

---

## 📚 Providers de Collection

Se usan en la clase `Collection<T>` para interactuar con una lista de items. Debes implementar la interfaz
`ICollectionProvider`:

### Interfaz

```ts
export interface ICollectionProvider {
	load(specs?: any): Promise<any>;
	list(specs?: any): Promise<any>;
	publish?(data: any): Promise<any>;
	remove?(specs?: any): Promise<any>;
}
```

### Métodos Clave

-   **`load(specs?)`** o **`list(specs?)`**: **(Requerido)** Obtiene una lista de items. Debe retornar:
    -   Un array de items directamente: `Promise<ItemData[]>`
    -   Un objeto con información de paginación: `Promise<{ items: ItemData[], next?: string, total?: number }>`
-   **`publish(data)`**: **(Opcional)** Crea o actualiza items en masa.
-   **`remove(specs?)`**: **(Opcional)** Elimina items de la colección.

### Ejemplo

```ts
import { ICollectionProvider } from '@beyond-js/reactive/entities/collection';

interface ILoadSpecs {
	where?: any;
	orderBy?: any;
	limit?: number;
	next?: string; // Cursor de paginación
}

export class UserCollectionProvider implements ICollectionProvider {
	async list(specs?: ILoadSpecs): Promise<IUser[] | { items: IUser[]; next?: string; total?: number }> {
		const params = new URLSearchParams();

		// Agregar filtros
		if (specs?.where) {
			params.append('filters', JSON.stringify(specs.where));
		}

		// Agregar paginación
		if (specs?.next) {
			params.append('cursor', specs.next);
		}

		if (specs?.limit) {
			params.append('limit', specs.limit.toString());
		}

		const response = await fetch(`/api/users?${params.toString()}`);

		if (!response.ok) {
			throw new Error(`Error al obtener usuarios: ${response.statusText}`);
		}

		const result = await response.json();

		// Retornar array o respuesta paginada
		if (result.items) {
			// Respuesta paginada: { items: [...], next: '...', total: 100 }
			return result;
		}

		// Respuesta de array simple
		return result.data || result;
	}

	async publish(data: IUser): Promise<IUser> {
		const response = await fetch(`/api/users`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data),
		});

		if (!response.ok) {
			throw new Error(`Error al publicar usuario: ${response.statusText}`);
		}

		const result = await response.json();
		return result.data || result;
	}
}
```

### Uso en Collection

```ts
import { Collection } from '@beyond-js/reactive/entities/collection';
import { User } from './user';
import { UserCollectionProvider } from './user-collection-provider';

class Users extends Collection<User, UserCollectionProvider> {
	constructor() {
		super({
			entity: 'users',
			provider: UserCollectionProvider,
			item: User,
		});
	}
}

// Uso
const users = new Users();
await users.load({ limit: 20 }); // Llama a UserCollectionProvider.list({ limit: 20 })
await users.load({ update: true }); // Carga la siguiente página usando el cursor interno
```

---

## ⚙️ Beneficios Clave

-   ✅ **Agnóstico del backend o motor de almacenamiento**: Funciona con APIs REST, GraphQL, IndexedDB, SQL, etc.
-   ✅ **Totalmente compatible con APIs remotas o almacenamiento local**: Implementa una vez, usa en cualquier lugar
-   ✅ **Interfaz uniforme**: Mismo patrón para cargar, guardar, eliminar
-   ✅ **Reutilizable y testeable**: Fácil de mockear para pruebas unitarias
-   ✅ **Escala desde archivos simples hasta capas de datos complejas**: Empieza simple, evoluciona según necesites

---

## 🧪 Mejores Prácticas de Implementación

### Manejo de Errores

Los métodos del provider deben manejar errores internamente y lanzar errores significativos:

```ts
async load(id: string): Promise<IUser> {
	try {
		const response = await fetch(`/api/users/${id}`);

		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		}

		const data = await response.json();
		return data.data || data;
	} catch (error) {
		// Registrar error si es necesario
		console.error('Error al cargar usuario:', error);
		// Re-lanzar con contexto
		throw new Error(`Error al cargar usuario ${id}: ${error.message}`);
	}
}
```

### Transformación de Respuestas

Los providers deben retornar **solo los datos**, no el wrapper de respuesta de la API:

```ts
// ❌ Mal: Retornando toda la respuesta
async load(id: string) {
	const response = await fetch(`/api/users/${id}`);
	return await response.json(); // Retorna { status: true, data: {...} }
}

// ✅ Bien: Retornando solo los datos
async load(id: string): Promise<IUser> {
	const response = await fetch(`/api/users/${id}`);
	const result = await response.json();
	return result.data; // Retorna solo el objeto usuario
}
```

### Seguridad de Tipos

Usa interfaces de TypeScript para asegurar la seguridad de tipos:

```ts
interface IUser {
	id: string;
	name: string;
	email: string;
}

export class UserProvider implements IEntityProvider {
	async load(id: string): Promise<IUser> {
		// TypeScript asegura que el tipo de retorno coincida con IUser
		// ...
	}
}
```

---

## 🔮 Uso Avanzado

### Lógica Personalizada del Provider

Puedes agregar lógica personalizada a tus providers:

```ts
export class UserProvider implements IEntityProvider {
	private cache = new Map<string, IUser>();

	async load(id: string): Promise<IUser> {
		// Verificar caché primero
		if (this.cache.has(id)) {
			return this.cache.get(id)!;
		}

		const user = await this.fetchFromAPI(id);
		this.cache.set(id, user);
		return user;
	}

	private async fetchFromAPI(id: string): Promise<IUser> {
		const response = await fetch(`/api/users/${id}`);
		const result = await response.json();
		return result.data;
	}
}
```

### Operaciones en Lote

Para colecciones, puedes implementar operaciones en lote:

```ts
export class UserCollectionProvider implements ICollectionProvider {
	async list(specs?: ILoadSpecs): Promise<IUser[]> {
		// Manejar carga en lote, filtrado, etc.
		// ...
	}

	async deleteMany(ids: string[]): Promise<boolean> {
		const response = await fetch('/api/users/batch', {
			method: 'DELETE',
			body: JSON.stringify({ ids }),
		});
		return response.ok;
	}
}
```

---

## 📄 Resumen

| Caso de Uso   | Clase           | Interfaz              | Tipo de Retorno                                           |
| ------------- | --------------- | --------------------- | --------------------------------------------------------- |
| Entidad Única | `Item<T>`       | `IEntityProvider`     | `Promise<ItemData>`                                       |
| Colección     | `Collection<T>` | `ICollectionProvider` | `Promise<ItemData[]>` o `Promise<{ items, next, total }>` |

Los providers manejan la complejidad de las interacciones con la API mientras proporcionan una interfaz limpia para tus
modelos reactivos. Validan respuestas, manejan errores y retornan solo los datos necesarios, manteniendo tus modelos
enfocados en gestionar estado y reactividad.
