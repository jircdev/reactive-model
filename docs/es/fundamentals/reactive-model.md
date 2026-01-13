# ReactiveModel

El `ReactiveModel<T>` es la clase base fundamental para definir entidades reactivas dentro de la biblioteca
ReactiveModel. Proporciona una forma estructurada de declarar propiedades reactivas, gestionar validación, manejar
estados de ciclo de vida y trabajar con comportamiento basado en eventos.

Esta clase está diseñada para ser extendida y definir modelos de datos específicos del dominio, como usuarios,
productos, configuraciones, etc.

## ✨ Beneficios y Características Principales

ReactiveModel ofrece una serie de características poderosas que hacen que trabajar con datos reactivos sea más sencillo
y eficiente:

### 🎯 Gestión de Items y Colecciones

-   **Items**: Gestión de entidades individuales con ciclo de vida completo (carga, guardado, eliminación)
-   **Colecciones**: Gestión de grupos de items con filtrado, ordenamiento y paginación automática
-   **Sincronización automática**: Los cambios se reflejan automáticamente en todas las instancias

### 📡 Sistema de Eventos Reactivos

-   **Eventos por propiedad**: Escucha cambios en propiedades específicas (`user.on('name.changed', ...)`)
-   **Eventos globales**: Escucha cambios generales (`user.on('change', ...)`)
-   **Eventos personalizados**: Dispara tus propios eventos con `trigger()`
-   **Reactividad granular**: Cada cambio dispara eventos específicos, permitiendo actualizaciones precisas en la UI

### ✅ Validación con Zod

-   **Integración nativa**: Define esquemas Zod usando un getter `schema`
-   **Validación automática**: Se valida automáticamente al usar `set()`
-   **Validación manual**: Usa `validate()` para validar sin actualizar
-   **Mensajes de error detallados**: Errores estructurados por propiedad

### 🔌 Desacoplamiento de Fuentes de Datos

-   **Providers**: Lógica de acceso a datos completamente desacoplada
-   **Flexibilidad**: Funciona con APIs REST, GraphQL, IndexedDB, localStorage, etc.
-   **Testeable**: Fácil de mockear providers para testing
-   **Reutilizable**: Un mismo modelo puede usar diferentes providers según el contexto

### 🎨 TypeScript y Autocompletado

-   **Type-safe**: TypeScript conoce los tipos de todas las propiedades
-   **Autocompletado**: IDE completa automáticamente nombres y tipos de propiedades
-   **Validación de tipos**: Errores de tipo detectados en tiempo de compilación

### 🔄 Gestión de Estado

-   **Estado unpublished**: Detecta automáticamente si el modelo ha sido modificado
-   **Estado draft**: Identifica modelos nuevos sin guardar
-   **Revertir cambios**: Restaura el estado inicial con `revert()`
-   **Guardar cambios**: Marca el estado como guardado con `saveChanges()`

### 🌳 Propiedades Anidadas

-   **Objetos reactivos**: Puedes tener Items o Collections como propiedades
-   **Reactividad en cascada**: Los cambios en objetos anidados se propagan correctamente
-   **Modelado de relaciones**: Modela relaciones complejas entre entidades

## 🧩 Herencia

```typescript
ReactiveModel<T> extends Events
```

-   `T`: Interfaz TypeScript que define la forma de los datos del modelo

## 📦 Constructor

```typescript
new ReactiveModel(options?: IReactiveModelOptions<T>)
```

### Parámetros

```typescript
interface IReactiveModelOptions<T> {
  properties?: EntityProperty<T>[];  // Array de propiedades reactivas
  ...initialValues                    // Valores iniciales para las propiedades
}
```

-   `properties`: Array de nombres de propiedades o descriptores de objetos reactivos anidados
-   `initialValues`: Cualquier propiedad adicional que se pase se usará como valor inicial

### Ejemplo Básico

```typescript
import { ReactiveModel } from 'reactive/model';

interface IUser {
	id: string;
	name: string;
	email: string;
}

class User extends ReactiveModel<IUser> {
	declare id: string;
	declare name: string;
	declare email: string;

	constructor(specs: Partial<IUser> = {}) {
		super({
			properties: ['id', 'name', 'email'],
			...specs,
		});
	}
}

const user = new User({ id: '1', name: 'Juan', email: 'juan@example.com' });
```

## 🔑 Propiedades Principales

### Propiedades de Estado

| Propiedad       | Tipo         | Descripción                                               |
| --------------- | ------------ | --------------------------------------------------------- |
| `fetching`      | `boolean`    | Indica si hay una operación de carga en curso             |
| `loaded`        | `boolean`    | `true` una vez que los datos están completamente cargados |
| `ready`         | `boolean`    | Emite `"ready"` cuando se establece en `true`             |
| `processing`    | `boolean`    | `true` si hay un proceso en curso                         |
| `processed`     | `boolean`    | `true` cuando un proceso se completa                      |
| `isDraft`       | `boolean`    | `true` si no se proporcionaron valores iniciales          |
| `initialValues` | `Partial<T>` | Instantánea de valores en la inicialización               |
| `unpublished`   | `boolean`    | `true` si el estado actual difiere del inicial            |
| `isReactive`    | `boolean`    | Siempre `true` (identificador de tipo)                    |
| `propertyNames` | `Set`        | Set de nombres de propiedades reactivas                   |

### Propiedades Internas

-   `properties`: Array de propiedades reactivas definidas
-   `_reactiveProps`: Objeto interno que almacena los valores de las propiedades reactivas

## ⚙️ Métodos Principales

### `set(properties: Partial<T>): SetPropertiesResult`

Actualiza una o más propiedades reactivas. Valida automáticamente contra el esquema si está definido.

**Parámetros:**

-   `properties`: Objeto parcial con las propiedades a actualizar

**Retorna:**

```typescript
{
  updated: boolean;                    // true si al menos una propiedad fue actualizada
  errors?: PropertyValidationErrors<T>; // Errores de validación si existen
}
```

**Comportamiento:**

-   Valida cada propiedad contra el esquema (si existe)
-   Para propiedades que son instancias de `ReactiveModel`, llama a su método `set()` o `setItems()` si es una
    Collection
-   Dispara eventos `"<propiedad>.changed"` para cada propiedad actualizada
-   Dispara eventos `"change"` y `"set.executed"` si al menos una propiedad fue actualizada

**Ejemplo:**

```typescript
const result = user.set({ name: 'Juan Pérez', email: 'juan.perez@example.com' });

if (result.updated) {
	console.log('Usuario actualizado');
}

if (result.errors) {
	console.log('Errores de validación:', result.errors);
}
```

### `getProperty<K extends keyof T>(key: K): T[K]`

Retorna el valor actual de una propiedad reactiva específica. **Usa este método solo cuando necesites acceso dinámico a propiedades** (cuando el nombre de la propiedad viene de una variable). Para acceso normal, usa acceso directo a la propiedad.

**Parámetros:**

-   `key`: Nombre de la propiedad (type-safe)

**Retorna:**

-   El valor de la propiedad

**Alias:**

-   `property` es un alias de `getProperty`

**Cuándo usar:**

-   ✅ **Usa acceso directo** (`user.name`) cuando conoces el nombre de la propiedad en tiempo de compilación (recomendado)
-   ✅ **Usa `getProperty()`** cuando el nombre de la propiedad viene de una variable o se determina dinámicamente

**Ejemplo:**

```typescript
// ✅ Recomendado: Acceso directo (más claro e idiomático)
const name = user.name;
const email = user.email;

// ✅ Usa getProperty() para acceso dinámico
const propName = 'name'; // Nombre de propiedad desde variable
const value = user.getProperty(propName);

// ✅ O cuando iteras sobre nombres de propiedades
for (const prop of ['name', 'email']) {
  const value = user.getProperty(prop as keyof User);
}
```

### `setProperty(key: string, value: any): void`

Actualiza directamente una propiedad reactiva específica sin validación.

**Parámetros:**

-   `key`: Nombre de la propiedad
-   `value`: Nuevo valor

**Nota:** Este método no dispara eventos ni valida. Usa `set()` para comportamiento completo.

### `getProperties(): Partial<T>`

Retorna un objeto plano con los valores actuales de todas las propiedades reactivas definidas.

**Comportamiento especial:**

-   Para propiedades que son instancias de `ReactiveModel`, llama a su método `getProperties()`
-   Para Collections, retorna `getItemProperties()` (array de items en lugar de la instancia de Collection)

**Ejemplo:**

```typescript
const props = user.getProperties();
// Retorna: { id: '1', name: 'Juan', email: 'juan@example.com' }

// Con propiedades anidadas
const postProps = post.getProperties();
// Retorna: {
//   id: '1',
//   title: 'Mi Post',
//   author: { id: '1', name: 'Juan' },
//   comments: [{ id: '1', content: '...' }, ...]
// }
```

### `validate(properties: Partial<T>): { valid: boolean; errors: PropertyValidationErrors<T> }`

Ejecuta validación contra el esquema (si está definido) y retorna el resultado.

**Parámetros:**

-   `properties`: Propiedades a validar

**Retorna:**

```typescript
{
	valid: boolean; // true si todas las propiedades son válidas
	errors: PropertyValidationErrors<T>; // Errores de validación por propiedad
}
```

**Ejemplo:**

```typescript
const validation = user.validate({ email: 'invalid-email' });

if (!validation.valid) {
	console.log('Errores de validación:', validation.errors);
}
```

### `revert(): void`

Restaura todas las propiedades del modelo a sus valores iniciales (`initialValues`).

**Ejemplo:**

```typescript
user.set({ name: 'Juan Pérez' });
// ... más cambios
user.revert(); // Restaura a los valores iniciales
```

### `saveChanges(): void`

Guarda el estado actual como el nuevo `initialValues`, limpiando el estado de draft/unpublished.

**Ejemplo:**

```typescript
user.set({ name: 'Juan Pérez' });
await user.publish(); // Guardar en servidor
user.saveChanges(); // Marcar como guardado localmente
```

### `setInitialValues(specs?: Partial<T>): Partial<T>`

Establece los valores iniciales del modelo basándose en las especificaciones proporcionadas.

**Parámetros:**

-   `specs`: Objeto parcial con valores iniciales

**Retorna:**

-   Los valores iniciales establecidos

**Nota:** Este método determina si el modelo es un draft verificando si el objeto specs está vacío.

## 🔄 Eventos

El `ReactiveModel` extiende de `@beyond-js/events`. Los eventos se pueden suscribir usando `on` y disparar con
`trigger`.

### Eventos Disponibles

| Evento           | Se dispara cuando                               | Datos del evento      |
| ---------------- | ----------------------------------------------- | --------------------- |
| `change`         | Cualquier propiedad reactiva cambia             | -                     |
| `<prop>.changed` | Una propiedad específica es actualizada         | `{ value, previous }` |
| `ready`          | La propiedad `ready` se establece en `true`     | -                     |
| `set.executed`   | Después de actualizaciones exitosas vía `set()` | -                     |

### Ejemplo de Uso de Eventos

```typescript
// Escuchar cambios en cualquier propiedad
user.on('change', () => {
	console.log('Usuario cambió:', user.getProperties());
});

// Escuchar cambios en una propiedad específica
user.on('name.changed', ({ value, previous }) => {
	console.log(`Nombre cambió de "${previous}" a "${value}"`);
});

// Escuchar cuando el modelo está listo
user.on('ready', () => {
	console.log('Usuario listo');
});
```

## 🧪 Validación con Zod

ReactiveModel tiene **integración nativa con Zod** para validación de propiedades. Esto permite definir esquemas de
validación robustos y obtener mensajes de error detallados.

### Cómo Funciona

La validación con Zod funciona mediante un **getter `schema`** que debes definir en tu clase. Este getter debe retornar
un objeto `ZodObject` que define las reglas de validación para cada propiedad.

### Definir un Esquema

Define el esquema usando un **getter `schema`** (no una propiedad normal):

```typescript
import { z } from 'zod';
import { ReactiveModel } from 'reactive/model';

interface IUser {
	id: string;
	name: string;
	email: string;
	age?: number;
}

class User extends ReactiveModel<IUser> {
	declare id: string;
	declare name: string;
	declare email: string;
	declare age?: number;

	// ⚠️ IMPORTANTE: Debe ser un getter, no una propiedad
	protected get schema() {
		return z.object({
			id: z.string().min(1, 'ID es requerido'),
			name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
			email: z.string().email('Email inválido'),
			age: z.number().min(0).max(150).optional(),
		});
	}

	constructor(specs: Partial<IUser> = {}) {
		super({
			properties: ['id', 'name', 'email', 'age'],
			...specs,
		});
	}
}
```

**⚠️ Nota importante:** El esquema debe ser un **getter** (`get schema()`), no una propiedad (`schema = ...`). Esto
permite que el esquema se evalúe cuando sea necesario.

### Validación Automática

Cuando defines un esquema, la validación se aplica **automáticamente** al usar `set()`:

```typescript
const user = new User();

// Esto validará automáticamente contra el esquema
const result = user.set({
	name: 'J', // ❌ Error: debe tener al menos 2 caracteres
	email: 'invalid', // ❌ Error: debe ser un email válido
});

if (result.errors) {
	// result.errors contiene los errores de validación por propiedad
	console.log('Errores de validación:', result.errors);

	// Ejemplo de acceso a errores específicos
	if (result.errors.name) {
		console.log('Error en nombre:', result.errors.name.error);
	}
}
```

**Comportamiento:**

-   Si la validación falla, las propiedades **no se actualizan**
-   Los errores se retornan en `result.errors`
-   Puedes verificar `result.updated` para saber si hubo actualizaciones

### Validación Manual

También puedes validar sin actualizar usando el método `validate()`:

```typescript
const user = new User();

// Validar sin actualizar
const validation = user.validate({
	name: 'J',
	email: 'invalid-email',
});

if (!validation.valid) {
	// Manejar errores
	Object.entries(validation.errors).forEach(([prop, error]) => {
		console.log(`Error en ${prop}:`, error.error);
	});
}
```

### Esquemas Avanzados

Puedes usar todas las características de Zod:

```typescript
protected get schema() {
  return z.object({
    id: z.string().uuid('ID debe ser un UUID válido'),
    name: z.string()
      .min(2, 'Mínimo 2 caracteres')
      .max(100, 'Máximo 100 caracteres')
      .regex(/^[a-zA-Z\s]+$/, 'Solo letras y espacios'),
    email: z.string()
      .email('Email inválido')
      .toLowerCase(),
    age: z.number()
      .int('Debe ser un número entero')
      .min(0, 'Edad mínima: 0')
      .max(150, 'Edad máxima: 150')
      .optional(),
    tags: z.array(z.string()).min(1, 'Al menos un tag'),
    status: z.enum(['active', 'inactive', 'pending'], {
      errorMap: () => ({ message: 'Estado inválido' })
    }),
  });
}
```

### Beneficios de la Validación con Zod

✅ **Validación automática**: Se valida al usar `set()`, sin código adicional  
✅ **Mensajes personalizados**: Define mensajes de error específicos  
✅ **Type-safe**: TypeScript conoce los tipos validados  
✅ **Validación sin actualizar**: Usa `validate()` para validar antes de actualizar  
✅ **Errores estructurados**: Errores organizados por propiedad  
✅ **Integración completa**: Funciona con todas las características de Zod

## 🧩 Propiedades Reactivas

### Propiedades Simples

Las propiedades simples se definen como strings en el array `properties`:

```typescript
class User extends ReactiveModel<IUser> {
	constructor() {
		super({
			properties: ['id', 'name', 'email'],
		});
	}
}
```

### Propiedades Anidadas (Objetos Reactivos)

Puedes definir propiedades que son otras instancias de `ReactiveModel`, `Item` o `Collection`:

```typescript
class User extends ReactiveModel<IUser> {
	constructor() {
		super({
			properties: [
				'id',
				'name',
				{
					name: 'profile',
					value: Profile, // Clase que extiende ReactiveModel
					properties: ['id', 'bio', 'avatar'],
				},
				{
					name: 'posts',
					value: Collection, // Collection
				},
			],
		});
	}
}
```

Para más detalles sobre propiedades anidadas, consulta la
[documentación de propiedades anidadas](./nested-properties.md).

### Agregar Propiedades Dinámicamente

Puedes agregar propiedades reactivas después de la inicialización usando `reactiveProps()`:

```typescript
class User extends ReactiveModel<IUser> {
	constructor() {
		super({
			properties: ['id', 'name'],
		});

		// Agregar propiedad reactiva adicional
		this.reactiveProps(['email']);
	}
}
```

## 📊 Gestión de Estado

### Estado Unpublished

La propiedad `unpublished` indica si el modelo ha sido modificado desde su estado inicial:

```typescript
const user = new User({ id: '1', name: 'Juan' });
console.log(user.unpublished); // false

user.set({ name: 'Juan Pérez' });
console.log(user.unpublished); // true

user.saveChanges();
console.log(user.unpublished); // false
```

El cálculo de `unpublished` considera:

-   Propiedades primitivas: comparación directa
-   Arrays: comparación de longitud y contenido
-   Objetos: comparación JSON
-   Objetos reactivos anidados: verifica su propiedad `unpublished`

### Estado Draft

Un modelo es un draft si no se proporcionaron valores iniciales:

```typescript
const user1 = new User(); // isDraft = true
const user2 = new User({ id: '1', name: 'Juan' }); // isDraft = false
```

### Estado Ready

La propiedad `ready` se puede usar para indicar que el modelo está completamente inicializado:

```typescript
user.ready = true; // Dispara evento 'ready'
```

## 🎓 Mejores Prácticas

### 1. Usa TypeScript

Declara las propiedades para obtener autocompletado y verificación de tipos:

```typescript
class User extends ReactiveModel<IUser> {
	declare id: string;
	declare name: string;
	declare email: string;
}
```

### 2. Define Propiedades Explícitamente

Siempre define el array `properties` para que el sistema sepa qué propiedades son reactivas:

```typescript
// ✅ Correcto
super({ properties: ['id', 'name', 'email'] });

// ❌ Incorrecto - las propiedades no serán reactivas
super({ id: '1', name: 'Juan' });
```

### 3. Usa set() para Actualizaciones

Usa `set()` en lugar de asignación directa para obtener validación y eventos:

```typescript
// ✅ Correcto
user.set({ name: 'Juan Pérez' });

// ⚠️ Funciona pero no dispara eventos ni valida
user.name = 'Juan Pérez';
```

### 4. Maneja Errores de Validación

Siempre verifica los errores cuando uses `set()`:

```typescript
const result = user.set({ email: 'invalid' });
if (result.errors) {
	// Manejar errores
}
```

### 5. Usa getProperties() para Serialización

Usa `getProperties()` cuando necesites serializar el modelo:

```typescript
const json = JSON.stringify(user.getProperties());
```

### 6. Escucha Eventos Apropiadamente

Escucha eventos específicos cuando sea posible en lugar de solo `change`:

```typescript
// ✅ Mejor - más específico
user.on('name.changed', ({ value }) => {
	console.log('Nombre cambió:', value);
});

// ⚠️ Funciona pero menos específico
user.on('change', () => {
	console.log('Algo cambió');
});
```

## ⚠️ Errores Comunes

### Error: Propiedad no reactiva

```typescript
// ❌ Incorrecto - no se define en properties
class User extends ReactiveModel<IUser> {
	constructor() {
		super({ properties: ['id'] });
	}
}
user.name = 'Juan'; // No es reactivo

// ✅ Correcto
class User extends ReactiveModel<IUser> {
	constructor() {
		super({ properties: ['id', 'name'] });
	}
}
```

### Error: Validación con esquema no definido

```typescript
// ❌ Error - el esquema no está definido
class User extends ReactiveModel<IUser> {
	constructor() {
		super({ properties: ['email'] });
	}
}
// No hay validación automática

// ✅ Correcto - definir esquema
class User extends ReactiveModel<IUser> {
	protected schema = z.object({
		email: z.string().email(),
	});
	// ...
}
```

### Error: Propiedades anidadas mal configuradas

```typescript
// ❌ Incorrecto - falta la estructura correcta
properties: ['profile']; // No funciona para objetos anidados

// ✅ Correcto
properties: [
	{
		name: 'profile',
		value: Profile,
		properties: ['id', 'bio'],
	},
];
```

## 📚 Ejemplo Completo

```typescript
import { ReactiveModel } from 'reactive/model';
import { z } from 'zod';

interface IUser {
	id: string;
	name: string;
	email: string;
	age?: number;
}

class User extends ReactiveModel<IUser> {
	declare id: string;
	declare name: string;
	declare email: string;
	declare age?: number;

	protected schema = z.object({
		id: z.string().min(1),
		name: z.string().min(2).max(100),
		email: z.string().email(),
		age: z.number().min(0).max(150).optional(),
	});

	constructor(specs: Partial<IUser> = {}) {
		super({
			properties: ['id', 'name', 'email', 'age'],
			...specs,
		});

		// Escuchar eventos
		this.on('change', () => {
			console.log('Usuario modificado');
		});

		this.on('name.changed', ({ value, previous }) => {
			console.log(`Nombre: ${previous} → ${value}`);
		});
	}

	// Métodos personalizados
	get isAdult(): boolean {
		return this.age ? this.age >= 18 : false;
	}

	updateProfile(data: Partial<IUser>) {
		const result = this.set(data);
		if (result.errors) {
			console.error('Errores de validación:', result.errors);
			return false;
		}
		return true;
	}
}

// Uso
const user = new User({
	id: '1',
	name: 'Juan',
	email: 'juan@example.com',
	age: 25,
});

// Actualizar
user.set({ name: 'Juan Pérez' });

// Validar
const validation = user.validate({ email: 'invalid' });
if (!validation.valid) {
	console.log('Email inválido');
}

// Serializar
const json = JSON.stringify(user.getProperties());

// Revertir cambios
user.revert();
```

---

Esta documentación proporciona una guía completa para trabajar con `ReactiveModel`. Para casos específicos de `Item` y
`Collection`, consulta sus respectivas documentaciones.
