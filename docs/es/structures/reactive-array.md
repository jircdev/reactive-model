# ReactiveArray

Una implementación de Array reactivo que emite eventos en cambios. Implementa `IReactiveContainer` para compatibilidad con ReactiveModel.

## Instalación

```typescript
import { ReactiveArray } from 'reactive/structures/array';
```

## Uso Básico

```typescript
const items = new ReactiveArray<string>({ items: ['a', 'b', 'c'] });

// Escuchar cambios
items.on('change', () => {
	console.log('Items cambiaron:', items.length);
});

// Operaciones tipo array
items.push('d', 'e');
items.pop();
items.unshift('z');
items.shift();

// Acceso por índice
const first = items.get(0);
items.set(0, 'nuevo valor');

// Verificar longitud
console.log(items.length); // o items.size
```

## Opciones del Constructor

```typescript
interface IReactiveArrayOptions<T> {
	// Items iniciales
	items?: T[];
	
	// Emitir eventos '{index}.changed' (por defecto: false)
	emitIndexEvents?: boolean;
}
```

## Métodos Mutantes

Estos métodos modifican el array y emiten eventos:

| Método | Descripción | Eventos |
|--------|-------------|---------|
| `push(...items)` | Agregar al final | `add`, `change` |
| `pop()` | Eliminar del final | `remove`, `change` |
| `unshift(...items)` | Agregar al inicio | `add`, `change` |
| `shift()` | Eliminar del inicio | `remove`, `change` |
| `splice(start, deleteCount, ...items)` | Insertar/eliminar en posición | `add`/`remove`, `change` |
| `sort(compareFn)` | Ordenar en su lugar | `reorder`, `change` |
| `reverse()` | Invertir en su lugar | `reorder`, `change` |
| `set(index, value)` | Establecer en índice | `update`/`add`, `change` |
| `delete(index)` | Eliminar en índice | `remove`, `change` |
| `clear()` | Eliminar todo | `remove`, `clear`, `change` |

## Métodos No Mutantes

Estos métodos retornan nuevos valores sin modificar el array:

```typescript
// Filtrado y búsqueda
const filtered = arr.filter(x => x > 5);
const found = arr.find(x => x > 5);
const index = arr.findIndex(x => x > 5);

// Transformación
const mapped = arr.map(x => x * 2);
const reduced = arr.reduce((acc, x) => acc + x, 0);

// Pruebas
const hasLarge = arr.some(x => x > 100);
const allPositive = arr.every(x => x > 0);

// Acceso
const slice = arr.slice(1, 3);
const includesValue = arr.includes(42);
const indexOf = arr.indexOf(42);
```

## Eventos

| Evento | Datos | Descripción |
|--------|-------|-------------|
| `add` | `{ items, index, method }` | Items fueron agregados |
| `remove` | `{ items, index, method }` | Items fueron eliminados |
| `update` | `{ index, value, previous }` | Item fue actualizado |
| `reorder` | `{ method, items }` | Array fue reordenado |
| `clear` | - | Array fue limpiado |
| `change` | - | Cualquier modificación ocurrió |
| `items.changed` | `{ items }` | Operación por lotes completada |

## Iteración

```typescript
// For...of
for (const item of arr) {
	console.log(item);
}

// forEach
arr.forEach((value, index) => {
	console.log(index, value);
});

// Iteradores
const values = [...arr.values()];
const entries = [...arr.entries()]; // [[0, value], [1, value], ...]
const keys = [...arr.keys()]; // [0, 1, 2, ...]
```

## Interfaz IReactiveValue

ReactiveArray implementa `IReactiveValue`:

```typescript
// Establecer todos los items
arr.setValue(['nuevo', 'items']);

// Obtener todos los items
const items = arr.getValue();

// Serializar para JSON
const json = arr.serialize();

// Verificar cambios
if (arr.hasUnpublishedChanges()) {
	// Guardar cambios
}

// Guardar estado actual como línea base
arr.saveChanges();

// Revertir al último estado guardado
arr.revert();
```

## Ejemplo: Lista de Tareas

```typescript
interface Todo {
	id: string;
	text: string;
	completed: boolean;
}

class TodoList {
	private todos = new ReactiveArray<Todo>();

	constructor() {
		this.todos.on('change', () => this.updateUI());
	}

	add(text: string): void {
		this.todos.push({
			id: crypto.randomUUID(),
			text,
			completed: false,
		});
	}

	toggle(id: string): void {
		const index = this.todos.findIndex(t => t.id === id);
		if (index !== -1) {
			const todo = this.todos.get(index)!;
			this.todos.set(index, { ...todo, completed: !todo.completed });
		}
	}

	remove(id: string): void {
		const index = this.todos.findIndex(t => t.id === id);
		if (index !== -1) {
			this.todos.delete(index);
		}
	}

	get completed(): Todo[] {
		return this.todos.filter(t => t.completed);
	}

	get pending(): Todo[] {
		return this.todos.filter(t => !t.completed);
	}

	private updateUI(): void {
		// Re-renderizar UI
	}
}
```

## Ejemplo: Lista Ordenada con Reordenamiento Automático

```typescript
class SortedList<T> {
	private items: ReactiveArray<T>;
	private compareFn: (a: T, b: T) => number;

	constructor(compareFn: (a: T, b: T) => number) {
		this.items = new ReactiveArray<T>();
		this.compareFn = compareFn;

		// Auto-ordenar al agregar
		this.items.on('add', () => {
			this.items.sort(this.compareFn);
		});
	}

	add(item: T): void {
		this.items.push(item);
		// Se ordenará automáticamente después de push
	}

	getAll(): T[] {
		return this.items.toArray();
	}
}
```
