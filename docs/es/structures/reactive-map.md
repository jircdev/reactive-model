# ReactiveMap

Una implementación de Map reactivo que emite eventos en cambios. Implementa `IReactiveContainer` para compatibilidad con ReactiveModel.

## Instalación

```typescript
import { ReactiveMap } from '@beyond-js/reactive/structures/map';
```

## Uso Básico

```typescript
interface User {
	id: string;
	name: string;
	email: string;
}

const users = new ReactiveMap<string, User>({
	keyExtractor: user => user.id,
});

// Escuchar cambios
users.on('change', () => {
	console.log('Usuarios cambiaron:', users.size);
});

// Agregar usuarios
users.set('user1', { id: 'user1', name: 'Juan', email: 'juan@ejemplo.com' });
users.set('user2', { id: 'user2', name: 'María', email: 'maria@ejemplo.com' });

// Obtener usuario
const juan = users.get('user1');

// Verificar existencia
if (users.has('user1')) {
	console.log('Usuario existe');
}

// Eliminar usuario
users.delete('user1');

// Limpiar todo
users.clear();
```

## Opciones del Constructor

```typescript
interface IReactiveMapOptions<K, V> {
	// Entradas iniciales
	entries?: Iterable<[K, V]>;
	
	// Extraer clave del valor (para operaciones con arrays)
	keyExtractor?: (value: V) => K;
	
	// Emitir eventos '{key}.changed' (por defecto: true)
	emitKeyEvents?: boolean;
}
```

## Métodos

### Operaciones CRUD

| Método | Descripción |
|--------|-------------|
| `get(key)` | Obtener valor por clave |
| `set(key, value)` | Establecer valor en clave |
| `has(key)` | Verificar si existe la clave |
| `delete(key)` | Eliminar por clave |
| `clear()` | Eliminar todas las entradas |

### Iteración

| Método | Descripción |
|--------|-------------|
| `keys()` | Iterador sobre claves |
| `values()` | Iterador sobre valores |
| `entries()` | Iterador sobre pares [clave, valor] |
| `forEach(callback)` | Ejecutar callback para cada entrada |

### Operaciones por Lotes

```typescript
// Establecer múltiples items a la vez
users.setItems([
	{ id: 'u1', name: 'Usuario 1' },
	{ id: 'u2', name: 'Usuario 2' },
], true); // true = limpiar existentes primero
```

### Métodos de Utilidad

```typescript
// Encontrar primer coincidencia
const admin = users.find(user => user.role === 'admin');

// Filtrar coincidencias
const activeUsers = users.filter(user => user.active);

// Mapear a nuevo array
const names = users.map(user => user.name);

// Convertir a array/map
const array = users.toArray();
const map = users.toMap();

// Guardar estado actual como línea base
users.saveChanges();

// Revertir al último estado guardado
users.revert();
```

## Eventos

| Evento | Datos | Descripción |
|--------|-------|-------------|
| `set` | `{ key, value, previous, isNew }` | Entrada fue establecida |
| `delete` | `{ key, value }` | Entrada fue eliminada |
| `clear` | `{ previousSize, previousEntries }` | Map fue limpiado |
| `change` | - | Cualquier modificación ocurrió |
| `{key}.changed` | `{ value, previous }` | Clave específica cambió |
| `items.changed` | `{ items }` | Operación por lotes completada |

## Interfaz IReactiveValue

ReactiveMap implementa `IReactiveValue`, haciéndolo compatible con propiedades de ReactiveModel:

```typescript
// Usar como propiedad en ReactiveModel
class Store extends ReactiveModel<Store> {
	constructor() {
		super({
			properties: [
				{
					name: 'users',
					value: ReactiveMap,
				},
			],
		});
	}
}
```

## Seguimiento de Cambios

```typescript
const map = new ReactiveMap<string, number>({
	entries: [['a', 1]],
});

console.log(map.hasUnpublishedChanges()); // false

map.set('b', 2);
console.log(map.hasUnpublishedChanges()); // true

map.saveChanges();
console.log(map.hasUnpublishedChanges()); // false
```

## Ejemplo: Almacén de Configuración

```typescript
interface ConfigValue {
	key: string;
	value: unknown;
	updatedAt: number;
}

class ConfigStore {
	private configs = new ReactiveMap<string, ConfigValue>({
		keyExtractor: config => config.key,
	});

	constructor() {
		this.configs.on('change', () => this.persist());
	}

	get(key: string): unknown {
		return this.configs.get(key)?.value;
	}

	set(key: string, value: unknown): void {
		this.configs.set(key, {
			key,
			value,
			updatedAt: Date.now(),
		});
	}

	private persist(): void {
		localStorage.setItem('config', JSON.stringify(this.configs.serialize()));
	}
}
```
