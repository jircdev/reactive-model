# AGENTS.md - Guía para Agentes AI

Este documento proporciona información esencial para agentes AI (como Cursor, GitHub Copilot, etc.) que trabajan con
este proyecto.

## 📋 Información del Proyecto

**Nombre:** `@beyond-js/reactive`  
**Tipo:** Librería TypeScript  
**Versión:** 3.0.0  
**Descripción:** Librería reactiva para gestión de datos con soporte para Items, Collections, modelos reactivos,
lifecycle hooks, computed properties, sistema de plugins, y estructuras de datos reactivas (ReactiveMap, ReactiveArray, ReactiveTree).

## 🏗️ Estructura del Proyecto

```
reactive-model/
├── src/                          # Código fuente principal
│   ├── modules/                  # Módulos de la librería
│   │   ├── model/                # ReactiveModel (bundle: model)
│   │   │   └── interfaces/       # IReactiveValue, IReactiveContainer
│   │   ├── entities/
│   │   │   ├── item/             # Item (bundle: entities/item)
│   │   │   └── collection/       # Collection (bundle: entities/collection)
│   │   ├── structures/           # Estructuras de datos reactivas (v3.0)
│   │   │   ├── map/              # ReactiveMap (bundle: structures/map)
│   │   │   ├── array/            # ReactiveArray (bundle: structures/array)
│   │   │   └── tree/             # ReactiveTree (bundle: structures/tree)
│   ├── __tests__/                # Tests
│   │   ├── source/               # Tests sobre código fuente
│   │   └── bundles/              # Tests sobre bundles compilados
│   ├── dist/                     # Bundles generados (no commitear)
│   ├── rollup.config.js          # Configuración de build
│   ├── jest.config.js            # Configuración Jest (código fuente)
│   ├── jest.config.bundles.js     # Configuración Jest (bundles)
│   └── package.json              # Dependencias y scripts
├── tests/                        # Proyecto de tests separado (beyond.js)
├── docs/                         # Documentación
└── AGENTS.md                     # Este archivo
```

## 🔑 Conceptos Clave

### Bundles Independientes

El proyecto genera **7 bundles independientes**:

1. **`events`** - Sistema de eventos base
2. **`model`** - Clase base `ReactiveModel` + interfaces `IReactiveValue`, `IReactiveContainer`
3. **`entities/item`** - Clase `Item` para entidades individuales
4. **`entities/collection`** - Clase `Collection` para grupos de items
5. **`structures/map`** - Clase `ReactiveMap` para mapas reactivos (v3.0)
6. **`structures/array`** - Clase `ReactiveArray` para arrays reactivos (v3.0)
7. **`structures/tree`** - Clase `ReactiveTree` para árboles reactivos (v3.0)

**Importante:** Los bundles son independientes. Cada uno puede importarse por separado y mantiene sus dependencias
internas como externas.

### Interfaces (v3.0)

Todas las entidades reactivas implementan interfaces unificadas:

```typescript
// IReactiveValue - Para cualquier valor reactivo
interface IReactiveValue<T> {
	readonly isReactive: true;
	setValue(value: T): void;
	getValue(): T;
	serialize(): unknown;
	hasUnpublishedChanges(): boolean;
}

// IReactiveContainer - Para colecciones (extiende IReactiveValue)
interface IReactiveContainer<T, K> extends IReactiveValue<T[]> {
	readonly isContainer: true;
	get(key: K): T | undefined;
	set(key: K, value: T): void;
	has(key: K): boolean;
	delete(key: K): boolean;
	// ...
}
```

**Implementaciones:**
- `ReactiveModel` → `IReactiveValue`
- `Item` → `IReactiveValue`
- `Collection` → `IReactiveContainer`
- `ReactiveMap` → `IReactiveContainer`
- `ReactiveArray` → `IReactiveContainer`
- `ReactiveTree` → `IReactiveValue`

### Imports

Los imports usan **bare specifiers** (no relativos):

```typescript
// ✅ Correcto
import { ReactiveModel } from '@beyond-js/reactive/model';
import { Item } from '@beyond-js/reactive/entities/item';

// ❌ Incorrecto (no usar imports relativos)
import { ReactiveModel } from '../../model/index';
```

### Magic Comments

Los comentarios `/*bundle*/` se **mantienen** para compatibilidad con beyond.js:

```typescript
export /*bundle*/ class ReactiveModel<T> extends Events {
	// ...
}
```

### Module.json

Los archivos `module.json` se **mantienen** para compatibilidad:

```json
{
	"name": "model",
	"bundle": "ts",
	"files": "*"
}
```

## 🛠️ Comandos Disponibles

### Build

```bash
cd src
npm run build              # Build completo
npm run build:watch        # Build en modo watch
```

### Tests

```bash
cd src
npm test                   # Todos los tests (código fuente)
npm run test:source        # Solo tests sobre código fuente
npm run test:bundles       # Solo tests sobre bundles (requiere build)
npm run test:model         # Tests de ReactiveModel
npm run test:item          # Tests de Item
npm run test:collection    # Tests de Collection
npm run test:watch         # Modo watch
npm run test:coverage      # Con cobertura
```

## 📦 Dependencias

### Runtime

-   `uuid` - Generación de IDs
-   `zod` - Validación

> **Nota**: El sistema de eventos (`Events`) está incluido localmente en `@beyond-js/reactive/events`, no es una dependencia externa.

### Desarrollo

-   `rollup` - Bundler
-   `@rollup/plugin-typescript` - Plugin TypeScript para Rollup
-   `rollup-plugin-dts` - Generación de tipos
-   `typescript` - Compilador TypeScript
-   `jest` - Framework de testing
-   `ts-jest` - Preset Jest para TypeScript

## 🔄 Flujo de Desarrollo

### 1. Desarrollo Normal

```bash
# Editar código en src/modules/
# Ejecutar tests sobre código fuente (rápido)
cd src
npm run test:source

# O tests específicos
npm run test:model
```

### 2. Validar Build

```bash
# Generar bundles
cd src
npm run build

# Validar bundles compilados
npm run test:bundles
```

### 3. Antes de Commit

```bash
cd src
npm run build              # Asegurar que build funciona
npm test                   # Todos los tests pasan
npm run test:coverage     # Verificar cobertura
```

## 📝 Convenciones de Código

### Exports

-   Usar `export /*bundle*/` para clases/interfaces principales
-   Mantener magic comments para compatibilidad

### Imports

-   **Siempre** usar bare specifiers: `@beyond-js/reactive/model`
-   **Nunca** usar imports relativos entre bundles

### TypeScript

-   Target: ES2018
-   Module: ESNext
-   Strict: false (compatibilidad con código existente)

### Tests

-   Tests sobre código fuente: `__tests__/source/`
-   Tests sobre bundles: `__tests__/bundles/`
-   Un archivo de test por módulo
-   Usar mocks para providers

## 🎯 Puntos de Atención para Agentes

### ⚠️ NO Hacer

1. **NO cambiar imports a relativos** - Mantener bare specifiers
2. **NO eliminar magic comments** `/*bundle*/` - Son para compatibilidad
3. **NO eliminar module.json** - Se mantienen para compatibilidad
4. **NO incluir dependencias internas en bundles** - Deben ser externas
5. **NO modificar exports en package.json** sin actualizar rollup.config.js

### ✅ Hacer

1. **Mantener estructura de bundles independientes**
2. **Usar bare specifiers en imports**
3. **Mantener compatibilidad con beyond.js** (module.json, magic comments)
4. **Ejecutar tests después de cambios**
5. **Validar build antes de commits importantes**

## 🔍 Archivos Críticos

### Configuración de Build

-   `src/rollup.config.js` - Configuración de bundles
-   `src/tsconfig.json` - Configuración TypeScript
-   `src/package.json` - Exports y scripts

### Tests

-   `src/jest.config.js` - Configuración tests código fuente
-   `src/jest.config.bundles.js` - Configuración tests bundles
-   `src/__tests__/source/` - Tests sobre código fuente
-   `src/__tests__/bundles/` - Tests sobre bundles

### Documentación

-   `src/TESTING.md` - Guía de testing
-   `AGENTS.md` - Este archivo
-   `docs/` - Documentación de usuario

## 🐛 Troubleshooting Común

### Build falla

1. Verificar que todas las dependencias estén instaladas: `npm install`
2. Verificar que `tsconfig.json` esté correcto
3. Verificar que `rollup.config.js` tenga las rutas correctas

### Tests fallan

**Tests sobre código fuente:**

-   Verificar `jest.config.js` y `moduleNameMapper`
-   Asegurarse de estar en directorio `src/`

**Tests sobre bundles:**

-   Ejecutar `npm run build` primero
-   Verificar que `dist/` contenga bundles generados
-   Usar `jest.config.bundles.js`

### Imports no resuelven

-   Verificar que se usen bare specifiers: `@beyond-js/reactive/model`
-   Verificar `moduleNameMapper` en configuración Jest
-   Verificar `exports` en `package.json`

## 📚 Recursos Adicionales

-   **Testing:** Ver `src/TESTING.md`
-   **Documentación Usuario:** Ver `docs/en/README.md`
-   **Contribución:** Ver `contributing.md`

## 🔗 Exports del Paquete

El paquete exporta 7 bundles:

```json
{
	"./events": { "..." },
	"./model": { "..." },
	"./entities/item": { "..." },
	"./entities/collection": { "..." },
	"./structures/map": { "..." },
	"./structures/array": { "..." },
	"./structures/tree": { "..." }
}
```

### Imports Recomendados

```typescript
// Core
import { ReactiveModel, IReactiveValue, isReactiveValue } from '@beyond-js/reactive/model';

// Entities
import { Item } from '@beyond-js/reactive/entities/item';
import { Collection } from '@beyond-js/reactive/entities/collection';

// Structures (v3.0)
import { ReactiveMap } from '@beyond-js/reactive/structures/map';
import { ReactiveArray } from '@beyond-js/reactive/structures/array';
import { ReactiveTree } from '@beyond-js/reactive/structures/tree';
```

## 💡 Tips para Agentes AI

1. **Siempre verificar estructura de bundles** antes de hacer cambios
2. **Mantener compatibilidad** - no romper exports existentes
3. **Ejecutar tests** después de cambios significativos
4. **Validar build** antes de sugerir cambios grandes
5. **Consultar TESTING.md** para entender cómo escribir tests
6. **Mantener magic comments** y `module.json` para compatibilidad
7. **Usar interfaces** - `isReactiveValue()` en lugar de checks manuales (v3.0)
8. **Collection.map está deprecado** - usar `collection.get(id)`, `collection.has(id)` (v3.0)

---

## 🔄 CAMBIOS EN v3.0

### Breaking Changes

1. **Collection.map deprecado**: Usar `collection.get(id)`, `collection.has(id)`, `collection.size`
2. **Collection.delete()**: Ahora es síncrono. Para async con provider usar `collection.deleteAsync()`
3. **isCollection/isReactive checks**: Usar `isReactiveValue()` y `isReactiveContainer()` del modelo

### Nuevas Estructuras

```typescript
// ReactiveMap - Map reactivo con eventos
const map = new ReactiveMap<string, User>({ keyExtractor: u => u.id });
map.on('change', () => console.log('Changed'));
map.set('user1', { id: 'user1', name: 'John' });

// ReactiveArray - Array reactivo con eventos
const arr = new ReactiveArray<number>({ items: [1, 2, 3] });
arr.on('add', ({ items }) => console.log('Added:', items));
arr.push(4, 5);

// ReactiveTree - Árbol reactivo para datos jerárquicos
const tree = new ReactiveTree<Category>({
	root: { id: 'root', name: 'Categories' },
});
tree.addNode('root', { id: 'electronics', name: 'Electronics' });
```

### Type Guards

```typescript
import { isReactiveValue, isReactiveContainer } from '@beyond-js/reactive/model';

// ✅ Correcto (v3.0)
if (isReactiveValue(value)) {
	value.setValue(data);
}

if (isReactiveContainer(value)) {
	value.setItems(data);
}

// ❌ Deprecado
if (value.isCollection) { ... }
if (value.isReactive) { ... }
```

---

## 🎯 TEMPLATES DE CÓDIGO PARA AGENTES AI

Esta sección contiene templates exactos que los agentes AI deben usar para generar código con ReactiveModel.

### Template: Interface de Entidad

```typescript
// types.ts
export interface I${EntityName} {
  id: string;
  // Agregar todas las propiedades de la entidad
  ${propertyName}: ${propertyType};
  // Propiedades opcionales
  ${optionalProperty}?: ${optionalType};
  // Timestamps comunes
  createdAt?: number;
  updatedAt?: number;
}
```

### Template: Item

```typescript
// item.ts
import { Item } from '@beyond-js/reactive/entities/item';
import { ${EntityName}Provider } from './provider';
import type { I${EntityName} } from './types';

export class ${EntityName} extends Item<I${EntityName}, ${EntityName}Provider> {
  // IMPORTANTE: Usar 'declare' para TODAS las propiedades
  declare id: string;
  declare ${propertyName}: ${propertyType};
  declare ${optionalProperty}?: ${optionalType};

  constructor(specs: Partial<I${EntityName}> = {}) {
    super({
      entity: '${entityName}',           // lowercase, singular
      provider: ${EntityName}Provider,
      properties: ['id', '${propertyName}', '${optionalProperty}'],
      ...specs,
    });
  }

  // Métodos de dominio (lógica de negocio)
  get isValid(): boolean {
    return !!this.id && !!this.${propertyName};
  }

  // Lifecycle hooks (opcionales)
  protected async beforePublish(data: Partial<I${EntityName}>): Promise<Partial<I${EntityName}>> {
    return { ...data, updatedAt: Date.now() };
  }
}
```

### Template: Collection

```typescript
// collection.ts
import { Collection } from '@beyond-js/reactive/entities/collection';
import { ${EntityName} } from './item';
import { ${EntityName}sProvider } from './provider';

export class ${EntityName}s extends Collection<${EntityName}, ${EntityName}sProvider> {
  constructor() {
    super({
      entity: '${entityName}',           // mismo nombre que el Item
      provider: ${EntityName}sProvider,
      item: ${EntityName},
      defaultLimit: 20,
    });
  }

  // Métodos de consulta personalizados
  async loadActive() {
    return this.load({
      where: { status: { equals: 'active' } },
    });
  }

  // Getters computados
  get activeItems(): ${EntityName}[] {
    return this.items.filter(item => item.status === 'active');
  }
}
```

### Template: Provider para Item

```typescript
// provider.ts
import { IEntityProvider, IItemProviderResponse } from '@beyond-js/reactive/entities/item';
import type { I${EntityName} } from './types';

export class ${EntityName}Provider implements IEntityProvider {
  #parent: unknown;

  constructor(parent: unknown) {
    this.#parent = parent;
  }

  async load(id?: string): Promise<I${EntityName}> {
    const response = await fetch(\`/api/${entityName}s/\${id}\`);
    if (!response.ok) {
      throw new Error(\`Failed to load ${entityName}\`);
    }
    const result = await response.json();
    return result.data || result;
  }

  async publish(data: Partial<I${EntityName}>): Promise<IItemProviderResponse<I${EntityName}>> {
    const method = data.id ? 'PUT' : 'POST';
    const url = data.id ? \`/api/${entityName}s/\${data.id}\` : '/api/${entityName}s';

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(\`Failed to save ${entityName}\`);
    }

    const result = await response.json();
    return { status: 200, data: result.data || result };
  }

  async delete(id: string): Promise<boolean> {
    const response = await fetch(\`/api/${entityName}s/\${id}\`, {
      method: 'DELETE',
    });
    return response.ok;
  }
}
```

### Template: Provider para Collection

```typescript
// collection-provider.ts
import { ICollectionProvider, IListResponse } from '@beyond-js/reactive/entities/collection';
import type { I${EntityName} } from './types';

export class ${EntityName}sProvider implements ICollectionProvider {
  #parent: unknown;

  constructor(parent: unknown) {
    this.#parent = parent;
  }

  async list(specs?: unknown): Promise<I${EntityName}[] | IListResponse<I${EntityName}>> {
    const params = new URLSearchParams();
    const args = specs as Record<string, unknown> || {};

    if (args.limit) params.append('limit', String(args.limit));
    if (args.next) params.append('cursor', String(args.next));
    if (args.where) params.append('filters', JSON.stringify(args.where));

    const response = await fetch(\`/api/${entityName}s?\${params}\`);
    if (!response.ok) {
      throw new Error('Failed to fetch ${entityName}s');
    }

    const result = await response.json();

    // Return paginated format if available
    if (result.items) {
      return {
        items: result.items,
        total: result.total,
        next: result.next,
      };
    }

    return result.data || result;
  }

  async deleteMany(ids: string[]): Promise<boolean> {
    const response = await fetch('/api/${entityName}s/batch', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids }),
    });
    return response.ok;
  }
}
```

### Template: Service (Orquestación)

```typescript
// service.ts
import { ${EntityName} } from './item';
import { ${EntityName}s } from './collection';
import { Other${EntityName} } from '../other-entity/item';

/**
 * Services se usan SOLO cuando:
 * 1. La operación involucra múltiples entidades
 * 2. Hay lógica de orquestación compleja
 * 3. La lógica no pertenece a ninguna entidad específica
 */
export class ${EntityName}Service {
  /**
   * Ejemplo: Crear entidad con relaciones
   */
  static async createWithRelations(
    data: Partial<I${EntityName}>,
    relatedData: Partial<IOther${EntityName}>
  ): Promise<${EntityName}> {
    // 1. Crear entidad principal
    const entity = new ${EntityName}(data);
    await entity.publish();

    // 2. Crear entidad relacionada
    const related = new Other${EntityName}({
      ...relatedData,
      ${entityName}Id: entity.id,
    });
    await related.publish();

    return entity;
  }
}
```

### Template: Computed Properties

```typescript
// item-with-computed.ts
import { Item } from '@beyond-js/reactive/entities/item';

interface IOrder {
	id: string;
	items: Array<{ price: number; quantity: number }>;
	discount: number;
	total?: number; // Computed
}

export class Order extends Item<IOrder> {
	declare items: Array<{ price: number; quantity: number }>;
	declare discount: number;

	constructor(specs: Partial<IOrder> = {}) {
		super({
			entity: 'orders',
			properties: ['id', 'items', 'discount'],
			computed: [
				{
					name: 'total',
					dependencies: ['items', 'discount'],
					compute: self => {
						const order = self as Order;
						const subtotal = (order.items || []).reduce((sum, item) => sum + item.price * item.quantity, 0);
						return subtotal - (order.discount || 0);
					},
				},
			],
			...specs,
		});
	}
}
```

### Template: Plugin

```typescript
// my-plugin.ts
import { IReactivePlugin, PluginManager } from '@beyond-js/reactive/model';

const myPlugin: IReactivePlugin = {
	name: 'my-plugin',
	priority: 100, // Higher = runs first

	// Interceptar antes de cargar
	onBeforeLoad: async (item, args) => {
		console.log('Loading:', args);
		return args; // Return modified or original args
	},

	// Interceptar después de cargar
	onAfterLoad: async (item, data) => {
		console.log('Loaded:', data);
		return data; // Return modified or original data
	},

	// Interceptar antes de guardar
	onBeforePublish: async (item, data) => {
		return { ...data, updatedAt: Date.now() };
	},

	// Interceptar después de guardar
	onAfterPublish: async (item, data) => {
		console.log('Published:', data);
	},
};

// Registrar globalmente
PluginManager.register(myPlugin);

// O para entidades específicas
PluginManager.register(myPlugin, { entities: ['users', 'products'] });
```

---

## 📋 CONVENCIONES OBLIGATORIAS

### Nomenclatura

| Concepto           | Convención              | Ejemplo                              |
| ------------------ | ----------------------- | ------------------------------------ |
| Entity name        | lowercase, singular     | `'user'`, `'product'`, `'orderItem'` |
| Item class         | PascalCase, singular    | `User`, `Product`, `OrderItem`       |
| Collection class   | PascalCase, plural      | `Users`, `Products`, `OrderItems`    |
| Provider class     | `${EntityName}Provider` | `UserProvider`, `ProductProvider`    |
| Interface          | `I${EntityName}`        | `IUser`, `IProduct`                  |
| Archivo Item       | `item.ts`               | `entities/user/item.ts`              |
| Archivo Collection | `collection.ts`         | `entities/user/collection.ts`        |
| Archivo Provider   | `provider.ts`           | `entities/user/provider.ts`          |
| Archivo Types      | `types.ts`              | `entities/user/types.ts`             |

### Estructura de Carpetas

```
/domain
  /entities
    /${entity-name}/           # ej: /user, /product, /order-item
      types.ts                 # Interface I${EntityName}
      item.ts                  # Class ${EntityName} extends Item
      collection.ts            # Class ${EntityName}s extends Collection
      provider.ts              # ${EntityName}Provider, ${EntityName}sProvider
      index.ts                 # Re-exports
  /services                    # Solo si hay orquestación multi-entidad
    ${entity-name}.service.ts
```

### Propiedades Obligatorias

1. **entity**: String lowercase singular (`'user'`)
2. **properties**: Array con TODAS las propiedades reactivas
3. **provider**: Clase del provider (no instancia)

### Declaración de Propiedades

```typescript
// ✅ CORRECTO: Usar 'declare' para todas las propiedades
declare id: string;
declare name: string;
declare email?: string;

// ❌ INCORRECTO: No usar asignación directa
id: string = '';  // NO
name = '';        // NO
```

---

## ⚠️ ERRORES COMUNES Y SOLUCIONES

### Error: "Entity is required"

```typescript
// ❌ Falta entity
new Item({ properties: ['id', 'name'] });

// ✅ Incluir entity
new Item({ entity: 'users', properties: ['id', 'name'] });
```

### Error: "Provider must be a class/constructor"

```typescript
// ❌ Pasando instancia
super({ provider: new UserProvider() });

// ✅ Pasando clase
super({ provider: UserProvider });
```

### Error: "DataProvider.load() did not return an item"

```typescript
// ❌ Provider retorna undefined o null
async load() { return null; }

// ✅ Provider retorna datos
async load() { return { id: '1', name: 'Test' }; }
```

### Propiedad no es reactiva

```typescript
// ❌ Falta en properties
constructor() {
  super({ entity: 'users', properties: ['id'] }); // Falta 'name'
}
this.name = 'Test'; // No dispara eventos

// ✅ Incluir en properties
constructor() {
  super({ entity: 'users', properties: ['id', 'name'] });
}
```

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

Cuando crees una nueva entidad, verifica:

-   [ ] Interface `I${EntityName}` definida con todas las propiedades
-   [ ] Item class extiende `Item<I${EntityName}, ${EntityName}Provider>`
-   [ ] Todas las propiedades declaradas con `declare`
-   [ ] `entity` es string lowercase singular
-   [ ] `properties` incluye TODAS las propiedades reactivas
-   [ ] `provider` es una clase, no una instancia
-   [ ] Provider implementa `IEntityProvider` con métodos necesarios
-   [ ] Provider.load() retorna datos directos (no wrapper)
-   [ ] Provider.publish() retorna `{ status: number, data: T }`
-   [ ] Collection class extiende `Collection<${EntityName}, ${EntityName}sProvider>`
-   [ ] Collection tiene `item: ${EntityName}` en constructor
-   [ ] Tests creados para Item y Collection

---

## 🎓 Contexto Histórico

Este proyecto fue migrado de **beyond.js** a un sistema de build estándar con **Rollup**. Se mantiene compatibilidad con
beyond.js mediante:

-   Magic comments `/*bundle*/`
-   Archivos `module.json`
-   Estructura de bundles independientes
-   Bare specifiers en imports

La migración permite:

-   Build sin dependencia de beyond.js
-   Generación de tipos TypeScript estándar
-   Tests independientes
-   Misma estructura de exports
