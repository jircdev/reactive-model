## 3.0.0

### Cambios Incompatibles

-   **Collection.map está deprecado**: El acceso directo al Map interno mediante `collection.map` ahora muestra una advertencia de deprecación. Usa los nuevos métodos en su lugar:
    -   `collection.get(id)` - Obtener item por ID
    -   `collection.has(id)` - Verificar si existe el ID
    -   `collection.size` - Número de items
    -   `collection.keys()` / `collection.values()` / `collection.entries()` - Iteradores
    -   `collection.forEach(callback)` - Iterar items

-   **Firma de Collection.delete() cambiada**: Ahora es síncrono para cumplir con `IReactiveContainer`.
    -   `collection.delete(id)` - Síncrono, retorna boolean
    -   `collection.deleteAsync(ids)` - Asíncrono con provider, retorna Promise<boolean[]>

-   **Métodos de verificación de tipo deprecados**: Usa type guards de interfaces en su lugar:
    -   ❌ `value.isCollection` / `value.isReactive`
    -   ✅ `isReactiveContainer(value)` / `isReactiveValue(value)`

### Agregado

-   **Interfaces Core**: Sistema de interfaces unificado para todos los valores reactivos
    -   `IReactiveValue<T>` - Interface base para valores reactivos
    -   `IReactiveContainer<T, K>` - Interface para estructuras tipo colección
    -   `isReactiveValue()` / `isReactiveContainer()` - Funciones type guard
    -   Todas las clases (ReactiveModel, Item, Collection) ahora implementan estas interfaces

-   **ReactiveMap**: Estructura Map clave-valor reactiva
    -   `@beyond-js/reactive/structures/map`
    -   Emite eventos `set`, `delete`, `clear`, `change`
    -   Implementa `IReactiveContainer`
    -   Soporta keyExtractor para operaciones basadas en arrays
    -   Seguimiento de cambios con `hasUnpublishedChanges()`, `saveChanges()`, `revert()`

-   **ReactiveArray**: Estructura Array reactiva
    -   `@beyond-js/reactive/structures/array`
    -   Versiones reactivas de: `push`, `pop`, `shift`, `unshift`, `splice`, `sort`, `reverse`
    -   Emite eventos `add`, `remove`, `update`, `reorder`, `change`
    -   Implementa `IReactiveContainer`
    -   Métodos no mutantes: `filter`, `map`, `find`, `some`, `every`, `reduce`

-   **ReactiveTree**: Estructura de árbol jerárquica reactiva
    -   `@beyond-js/reactive/structures/tree`
    -   Mantiene relaciones padre/hijos
    -   Acceso basado en rutas: `tree.getByPath('root.child.grandchild')`
    -   Recorrido: `walkDepthFirst()`, `walkBreadthFirst()`, `findNode()`, `findNodes()`
    -   Operaciones de nodos: `addNode()`, `removeNode()`, `moveNode()`, `updateNode()`
    -   Emite eventos `node.added`, `node.removed`, `node.moved`, `change`

-   **Nuevos Métodos de Collection**:
    -   `get(id)` - Obtener item por ID
    -   `has(id)` - Verificar si existe el ID
    -   `size` - Número de items (getter)
    -   `keys()`, `values()`, `entries()` - Iteradores
    -   `forEach()` - Iterar con callback
    -   `clear()` - Remover todos los items
    -   `find()`, `filter()`, `mapItems()`, `some()`, `every()` - Métodos de consulta
    -   `deleteAsync()` - Eliminación asíncrona con soporte de provider

-   **Nuevos Métodos de ReactiveModel** (implementación de IReactiveValue):
    -   `setValue(value)` - Alias para `set()`
    -   `getValue()` - Alias para `getProperties()`
    -   `serialize()` - Serialización JSON
    -   `hasUnpublishedChanges()` - Alias para el getter `unpublished`

-   **Nueva Documentación**:
    -   `docs/es/structures/reactive-map.md`
    -   `docs/es/structures/reactive-array.md`
    -   `docs/es/structures/reactive-tree.md`
    -   `docs/es/fundamentals/interfaces.md`
    -   `docs/es/migration-v3.md`

### Cambiado

-   **ReactiveModel**: Ahora implementa `IReactiveValue<Partial<T>>`
    -   Eliminadas verificaciones hardcodeadas `isReactiveModel()` e `isCollectionModel()`
    -   Usa verificación de interface `isReactiveValue()` para manejo de propiedades anidadas
    -   Usa `serialize()` para obtener valores de propiedades reactivas anidadas

-   **Item**: Ahora implementa explícitamente `IReactiveValue<Partial<T>>`
    -   Agregado método `serialize()`

-   **Collection**: Ahora implementa `IReactiveContainer<T, ItemId>`
    -   Agregada propiedad `isContainer: true`
    -   Propiedades estáticas `isCollection` e `isContainer` (deprecadas, usa verificación de instancia)
    -   `setItems()` ahora acepta `Map<ItemId, T>` además de arrays

-   **Generación de instanceId del Registry**: Cambiado de UUID v4 a UUID v7
    -   UUID v7 incluye timestamp, proporcionando ordenamiento natural basado en tiempo
    -   Mejora el rendimiento de índices de base de datos (reduce fragmentación)
    -   Mejor eficiencia de caché y depuración más fácil
    -   Sin cambios incompatibles - misma API, solo cambia el formato del ID

-   **AGENTS.md**: Actualizado con cambios de v3.0, nuevas estructuras y documentación de interfaces

### Guía de Migración

Ver `docs/es/migration-v3.md` para instrucciones detalladas de migración de v2.x a v3.0.

---

## 2.3.0

### Agregado

-   **Lifecycle Hooks**: Nuevos métodos protegidos para interceptar operaciones CRUD
    -   `beforeLoad(args)` / `afterLoad(data)` - Transformar argumentos y resultados de carga
    -   `beforePublish(data)` / `afterPublish(data)` - Transformar y reaccionar a operaciones de publicación
    -   `beforeDelete(id)` / `afterDelete(id)` - Validar y reaccionar a operaciones de eliminación
    -   `beforeSet(props)` / `afterSet(props, result)` - Transformar y reaccionar a cambios de propiedades
    -   Todos los hooks soportan async/await para operaciones asíncronas

-   **Lifecycle Events**: Nuevos eventos emitidos durante operaciones CRUD
    -   `pre:load`, `post:load` - Antes y después de carga
    -   `pre:publish`, `post:publish` - Antes y después de publicación
    -   `pre:delete`, `post:delete` - Antes y después de eliminación
    -   `pre:set`, `post:set` - Antes y después de set (vía `setAsync()`)

-   **Sistema de Plugins**: Arquitectura extensible para agregar preocupaciones transversales
    -   Interface `IReactivePlugin` para definir plugins
    -   `PluginManager` para registrar/desregistrar plugins globalmente o por entidad
    -   Orden de ejecución basado en prioridad (mayor prioridad se ejecuta primero)
    -   Los plugins pueden interceptar y transformar datos en cualquier punto del lifecycle
    -   Ideal para caché, persistencia, logging, validación y sincronización offline

-   **Computed Properties**: Propiedades derivadas que se recalculan automáticamente
    -   Define vía array `computed` en opciones del constructor
    -   Especifica dependencias para invalidación automática de caché
    -   Emite eventos `<name>.changed` cuando los valores cambian
    -   Los valores se cachean hasta que las dependencias cambien

-   **Transactions**: Agrupa múltiples cambios con emisión de evento único
    -   `model.transaction(() => { ... })` - Agrupar cambios
    -   Solo se emite un evento `change` al final
    -   Útil para actualizaciones atómicas de propiedades relacionadas

-   **Partial Updates**: Rastrea y publica solo propiedades cambiadas
    -   `item.changedProperties` - Array de nombres de propiedades modificadas
    -   `item.getChangedValues()` - Objeto con solo valores cambiados
    -   `item.publish(undefined, { partial: true })` - Enviar solo cambios
    -   `item.clearChangedProperties()` - Reiniciar seguimiento

-   **Async Set**: Nuevo método `setAsync()` que espera correctamente los lifecycle hooks
    -   Usa cuando necesites que los hooks se completen antes de continuar
    -   Emite eventos `pre:set` y `post:set`

-   **Nueva Documentación**:
    -   `docs/es/services.md` - Guía para implementar capa de servicios
    -   `docs/es/backend-usage.md` - Usando ReactiveModel en Node.js/Bun
    -   `docs/es/plugins.md` - Documentación del sistema de plugins

### Cambiado

-   **Tipos TypeScript Mejorados**: Eliminados la mayoría de tipos `any` para mejor seguridad de tipos
    -   `IItemProps`, `IEntityProvider`, `ICollectionProvider` ahora usan genéricos apropiados
    -   `SetPropertiesResult.errors` correctamente tipado
    -   `ModelProperties<T>` ahora retorna `Partial<T>` en lugar de `any`

-   **AGENTS.md Actualizado**: Templates y convenciones completas para agentes AI
    -   Templates de código para Item, Collection, Provider, Service
    -   Convenciones de nomenclatura y estructura de carpetas
    -   Errores comunes y soluciones
    -   Checklist de implementación

### Corregido

-   **Seguridad de tipos del Registry**: Mejor tipado para operaciones del registry

---

## 2.2.0

### Cambios

-   **Integración del Sistema de Eventos**: La dependencia `@beyond-js/events` ha sido removida y el sistema de Eventos ahora está incluido como parte del paquete `@beyond-js/reactive`.
    -   Anteriormente, `@beyond-js/reactive` dependía de `@beyond-js/events` como una dependencia externa.
    -   Ahora, la clase `Events` y sus tipos relacionados están incluidos como parte del paquete bajo el export `@beyond-js/reactive/events`.
    -   Este cambio elimina la necesidad de `@beyond-js/events` y `@beyond-js/kernel` como dependencias externas, haciendo el paquete más autocontenido.
    -   **Migración**: Si estabas importando `Events` desde `@beyond-js/events/events`, actualiza tus imports para usar `@beyond-js/reactive/events` en su lugar.
    -   **Impacto**: Este es un incremento de versión menor ya que mantiene la compatibilidad de la API mientras reduce las dependencias externas.

## 2.1.4

### Fixed

-   **Reinicio de colecciones al actualizar con ReactiveModel.set**: Garantiza que las propiedades de tipo colección limpien sus elementos antes de cargar nuevos datos cuando se actualizan desde el método `set` del modelo padre.
    -   Anteriormente, al invocar `set` con una nueva lista de elementos en una propiedad colección, los registros obsoletos permanecían en memoria.
    -   Ahora, `setItems` recibe la bandera `clear` para reconstruir el mapa interno antes de hidratar la colección, manteniendo la información alineada con el payload recibido.

## 2.1.2

### Fixed

-   **Manejo de Propiedades de Colección en ReactiveModel**: Corregido un problema en el método `set` donde las propiedades de tipo colección no eran identificadas correctamente y sus items no se establecían.
    -   Anteriormente, al establecer propiedades en un `ReactiveModel`, el código solo verificaba si una propiedad era reactiva pero no distinguía entre modelos reactivos regulares y colecciones.
    -   Ahora, el método `set` detecta correctamente cuando una propiedad es una colección (vía verificación `isCollection`) y llama a `setItems()` en lugar de `set()` para poblar correctamente los items de la colección.
    -   Esta corrección asegura que cuando una colección se define como propiedad de un objeto modelo reactivo, los items se establecen correctamente al llamar al método `set()`.
    -   **Impacto**: Las colecciones definidas como propiedades en objetos modelo ahora recibirán y establecerán correctamente sus items cuando se actualicen las propiedades.
    -   **Nota**: El getter `isCollection` es solo para uso interno y puede ser removido en versiones futuras. No debe usarse directamente en código de aplicación.

## 2.1.0

### Agregado

-   Soporte de paginación en el método `load`:
    -   El método `load` ahora soporta obtención de resultados paginados usando un parámetro interno `next`.
    -   El nombre del parámetro `next` puede configurarse usando la opción `nextParamName`.
    -   Se agregó un parámetro `limit` para especificar el número de resultados por página.
    -   Los providers ahora pueden retornar un objeto en la forma `{ items, next, total }` además de un array simple.
    -   Esto permite integración más flexible con APIs paginadas y mejora la carga incremental de datos.
    -   Ejemplo de uso:
        ```ts
        collection.load({ limit: 20 });
        // El método load manejará el parámetro `next` internamente.
        // el provider puede retornar: { items: [...], next: 'nextCursor', total: 100 }
        ```

## 2.0.6

### Mejorado

-   El método `delete` de `Item` ahora soporta eliminación en memoria y asegura comunicación entre el registry y las colecciones suscritas. Esta mejora integrada garantiza que, cuando un item se elimina, el cambio se refleja correctamente en memoria y todas las colecciones relacionadas son notificadas, mejorando la reactividad y consistencia del estado.

### Agregado

-   Agregado el método `addItems` a `Collection`.
    -   **Propósito**: Permite agregar múltiples items a una colección a la vez.
    -   **Comportamiento**: Recibe un array de items, los establece en la colección y dispara los eventos `items.changed` y `change` para actualizar suscriptores y mantener la reactividad.
    -   **Uso**:
        ```ts
        collection.addItems([{ id: 1, ... }, { id: 2, ... }]);
        ```

## 2.0.5

### Agregado

-   Introducido un nuevo parámetro `register` en el constructor de `Item` dentro de `IItemProps`.
    -   **Tipo**: `boolean`
    -   **Propósito**: Permite especificar si las colecciones suscritas a la entidad definida necesitan ser informadas sobre este item. Esto es particularmente útil para crear items que ya existen fuera de la memoria de la aplicación.
    -   **Comportamiento**: Si `register` se establece en `true`, el registry disparará un evento cuando el item se cree para notificar a las colecciones. Esto asegura que las colecciones sean conscientes de items que se instancian desde fuentes externas.

## 2.0.4

### Agregado

-   Agregada documentación JSDoc completa a métodos clave en ReactiveModel:
    -   `validate`: Documenta validación de propiedades contra esquema Zod
    -   `getProperties`: Documenta recuperación de propiedades incluyendo objetos anidados
    -   `revert`: Documenta funcionalidad de restauración de estado
    -   `saveChanges`: Documenta funcionalidad de persistencia de estado

## 2.0.3

### Fixed

-   Cambiado la función `triggerEvent` en ReactiveModel a una función flecha para mantener el scope correcto de `this`
-   Definido `triggerEvent` como deprecado, se recomienda usar el método `trigger` en su lugar.

## 2.0.1

Esta versión introduce integración de **Zod** para validaciones, nuevas mejoras orientadas a eventos para cambios de propiedades, una reorganización de la estructura del código, y un enfoque revisado de cómo `Item` y `Collection` reciben datos del provider. También cambia **cómo se definen las propiedades** en los modelos—las propiedades ahora se pasan al constructor en lugar de definirse vía una propiedad `get`.

---

### Cambios Incompatibles

1. **Subpaths Separados para `Item` & `Collection`**

    - En las versiones `1.1.x`, tanto los objetos `Item` como `Collection` estaban ubicados bajo un solo subpath.
    - Ahora, cada uno tiene su **propio** subpath:
        - `@beyond-js/reactive/entities/item`
        - `@beyond-js/reactive/entities/collection`
    - Este cambio **requiere actualizar tus imports**.

2. **Definiciones de Propiedades en Constructor**

    - Anteriormente, el array de **properties** para un modelo/item se definía vía una **propiedad `get`** dentro de la clase.
    - **Ahora**, debes pasar el **array de properties** directamente a la llamada del constructor **`super()`**.
    - Ejemplo (nuevo enfoque):
        ```ts
        export class MyModel extends Model {
        	constructor() {
        		super({
        			properties: ['id', 'name', 'lastname'],
        		});
        	}
        }
        ```

3. **Parámetros de Constructor para `Item` & `Collection`**

    - Anteriormente, los constructores podían recibir propiedades para integración con IndexedDB.
    - **El soporte de IndexedDB ha sido removido** del core y será manejado vía plugins.
    - **Nuevo** requisito: una propiedad `"entity"` en el constructor para identificar el nombre de la entidad (para integraciones de plugins o uso personalizado).

4. **Formato de Respuesta del Provider**
    - Anteriormente, los métodos `load` tanto en `Item` como en `Collection` esperaban que los providers retornaran respuestas con una estructura específica: `{ status: boolean, data: any }`.
    - **Ahora**, los providers deben retornar los datos crudos directamente:
        - Para `Collection.load()`: Un array de items directamente (`Item[]`)
        - Para `Item.load()`: El objeto de datos del item directamente (`ItemData`)
    - Este cambio desacopla los modelos de estructuras de respuesta de API específicas, permitiendo más flexibilidad en los providers de datos.
    - Ejemplo (enfoque antiguo):
        ```ts
        // Antes (1.x.x)
        async load() {
            const response = await this.provider.load();
            if (response.status) {
                this.set(response.data);
            }
        }
        ```
    - Ejemplo (nuevo enfoque):
        ```ts
        // Ahora (2.0.0)
        async load() {
            const data = await this.provider.load();
            this.set(data);
        }
        ```
    - **Migración**: Actualiza tus providers para manejar respuestas de API internamente y retornar solo los datos relevantes a los modelos.

---

### Nuevas Características y Mejoras

1. **Integración de Zod para Validaciones**

    - Los esquemas Zod ahora pueden definirse por `Model`, `Item`, o `Collection` (donde sea aplicable).
    - Proporciona **validación de datos en tiempo de ejecución** y mejor inferencia de tipos.
    - Ejemplo de uso:

        ```ts
        import { z } from 'zod';
        //crear un getter en la definición de la clase modelo
        get schema () {
            return  z.object({
        	id: z.number().min(1),
        	username: z.string().nonempty(),
        });
        }

        ```

2. **Método `validate`**

    - Un nuevo método `validate()` verifica si **todas las propiedades** de un objeto se conforman al esquema Zod adjunto.
    - Retorna éxito/fallo de validación o lanza un error (dependiendo de tu uso).

3. **Propiedad `schema`**

    - Las entidades ahora tienen una propiedad `schema` que puede referenciar un esquema Zod para validación.

4. **Eventos de Cambio de Propiedades**

    - Cada propiedad **dispara un evento personalizado** al cambiar, proporcionando **reactividad de grano fino**.
    - La firma del evento: `(eventName, updatedObjectOrProperty)`.
        - El **segundo parámetro** da acceso directo a la propiedad u objeto cambiado.

5. **Propiedad `unpublished`**

    - Una nueva bandera `unpublished` ayuda a rastrear cuando un objeto ha cambiado localmente pero aún no ha sido "publicado" o sincronizado.
    - Útil para flujos de trabajo offline/staging.

6. **Dos Genéricos en `Item`**

    - `Item<TProps, TProvider>`:
        - **`TProps`**: interface que define las **propiedades**.
        - **`TProvider`**: interface que define los **métodos del provider**.
    - Mejora el autocompletado de TypeScript y la seguridad de tipos para uso de datos + provider.

7. **Objetos Anidados en Definiciones de Propiedades**

    - Ahora puedes definir **objetos anidados** marcando una propiedad como objeto dentro del array de definiciones de propiedades.
    - Esto permite estructuras de datos más complejas y jerárquicas en una sola entidad reactiva.

8. **`Item` & `Collection` Reciben Datos del Provider**
    - Los objetos de entidad (`Item` y `Collection`) ahora dependen de un **provider** para suministrar la respuesta de la API.
    - El provider es responsable de capturar y validar la respuesta de la API, luego retornar datos correctamente estructurados.
    - Esto asegura que el modelo reactivo tenga datos **precisos**, **validados** y centraliza la lógica de API en la capa del provider.

---

### Removido

1. **Integración Core de IndexedDB**
    - La librería ya no incluye soporte de IndexedDB por defecto.
    - Esto ahora es **basado en plugins**, así que solo lo agregas si tu proyecto necesita almacenamiento offline.

---

### Resumen

**v2.0.1** mejora significativamente la flexibilidad y seguridad de tipos con integración de **Zod**, agrega manejo de **eventos** más granular, y refactoriza la estructura del código en **subpaths separados**. Los **cambios incompatibles** clave a tener en cuenta incluyen:

-   **Subpaths separados** para `Item` y `Collection`.
-   **Uso de constructor revisado** (array de properties ahora se pasa a `super()`).
-   **IndexedDB** integración removida del core (ahora basado en plugins).
-   **Entidades** deben especificar una propiedad `"entity"` en el constructor.
-   **Datos de API** ahora se proporcionan vía un método **provider**, que maneja y valida la respuesta antes de poblar el modelo.

Actualiza cuidadosamente para acomodar estos cambios. Una vez actualizado, te beneficiarás de validaciones más fuertes, comportamiento más robusto orientado a eventos, y una separación más clara de responsabilidades entre obtención de datos y gestión de estado reactivo.

¡Disfruta las nuevas características y validaciones en **v1.2.0**!

## [1.1.13] - 2024-09-27

### Fixed

-   **Manejo Incorrecto de Errores en Método `save`**:
    -   Removida la llamada a `fromRemote` en la respuesta del método `publish`, que causaba propagación incorrecta de errores.
    -   Actualizado el método `save` para manejar la respuesta de `publish` directamente y lanzar correctamente la respuesta cuando `status: false`.
    -   El error real del backend ahora se retorna al cliente en lugar del mensaje de error genérico "ERROR_DATA_QUERY", mejorando la depuración y manejo de errores.

### Testing

-   Los errores disparados en el backend ahora se propagan correctamente y son recibidos por el cliente.

## 1.1.12

### Mejoras

-   **Mejora de Tipos e Interfaces:** Mejorado el código base de ReactiveModel con tipos más explícitos e interfaces corregidas, mejorando significativamente la compatibilidad con TypeScript y la experiencia del desarrollador. Esta actualización asegura que los desarrolladores que aprovechan TypeScript puedan trabajar más eficientemente con ReactiveModel, beneficiándose de verificaciones de tipos más fuertes y comportamiento más predecible.

### Correcciones

-   **Manejo de Respuesta Remota de Publicación de Item (#29):** Abordado un problema donde la respuesta de publicar un item remotamente no se retornaba correctamente. El problema se ha resuelto ajustando el mecanismo de manejo de respuestas. Ahora, las respuestas del provider remoto se capturan y retransmiten con precisión al cliente a través del mecanismo de adaptador. Esta corrección asegura que el método `response` de la entidad Item represente fielmente los datos proporcionados por el servicio remoto, mejorando la confiabilidad y integridad de datos en comunicaciones cliente-servidor.

## 1.1.11

#### Fixed

-   Resolver problema cuando un item se inicializa directamente. Ahora el método set solo establece propiedades definidas

## 1.1.10

#### Fixed

-   Simplificado el manejo de eventos en el proceso de carga de colecciones para corregir el problema de generación múltiple de eventos.

#### Added

-   Ahora, los objetos ReactiveModel pueden recibir un array de propiedades en el constructor, siguiendo la interface `IReactiveConstructorSpecs`:

```typescript
interface IReactiveConstructorSpecs {
	properties?: string[];
	[key: string]: any;
}
```

## 1.1.9

-   feat: mejorar colecciones para soportar parámetros 'where' arbitrarios para consultas del lado del servidor y búsquedas indexeddb del lado del cliente

## 1.1.7

#### Mejoras

-   **Identificación Mejorada de Items**: Para proporcionar más flexibilidad y control sobre la identificación de items, la librería ahora soporta y prioriza IDs definidos por el backend. Mientras que los IDs generados por el cliente aún se aceptan, los IDs definidos por el backend, cuando estén disponibles, se usarán como identificador principal.

#### Lo que Cambió

-   **Prioridad a IDs del Backend**: Cuando un ID se define desde el backend para un item, este ID ahora tomará precedencia sobre cualquier ID generado por el cliente. Esto asegura que los items puedan identificarse y gestionarse de manera más confiable en sistemas donde el control del backend es primordial.

#### Implicaciones para Proyectos Existentes

-   **Compatibilidad Hacia Atrás**: Los proyectos existentes continuarán funcionando como antes, usando IDs generados por el cliente. Sin embargo, ahora puedes mejorar tu gestión de items integrando IDs definidos por el backend.
-   **Flexibilidad Mejorada**: Esta actualización proporciona la flexibilidad para mantener la generación de IDs del lado del cliente existente mientras también permite un sistema de identificación más robusto impulsado por el backend cuando sea necesario.

## 1.1.6

-   Agregado concepto de Adapters para gestionar respuestas obtenidas del backend y respuestas retornadas por items y colecciones.
-   bugfix: las propiedades `fetching`, `loading`, `loaded` y `found` funcionan correctamente

## 1.1.5

-   Agregado método initialise para ser llamado en constructores de items. Este método te permite asegurar
-   ejecutar lógica en la instancia del objeto que requiere la gestión de las propiedades definidas en el item.

## 1.1.3

-   Agregada una validación en el localProvider de la clase Collection para verificar si el store especificado existe en la base de datos. Si el store no existe, se lanzará un error para manejar la situación apropiadamente.

### 1.1.2

-   Corrección de error: Corregido error al pasar parámetros en el método post de Item.

## 1.1.1 (20 de julio, 2023)

### Item y collection

-   Nueva característica: Ahora los métodos como save, publish y load pueden sobrescribirse en objetos Children y llamar al método super. Esto es útil cuando es necesario gestionar lógica antes de ejecutar el método o después de él.
-   Corrección de error: Corregido un error cuando el mismo registry se instancia múltiples veces.

## [Unreleased]

### Agregado

-   **Eliminación Masiva en Colecciones**: La clase `Collection` ahora incluye un nuevo método `delete` que permite la eliminación de uno o múltiples items por sus IDs. Este método acepta un solo `ItemId` o un array de valores `ItemId`.

    -   **Integración de Provider**: Si el provider asociado implementa un método `deleteMany`, `Collection.delete` lo invocará para sincronizar eliminaciones con una capa de datos externa (como una API backend o base de datos). Esto asegura que las eliminaciones se reflejen tanto en memoria como en la fuente de datos persistente.
    -   **Fallback en Memoria**: Si el provider no define un método `deleteMany`, el método `delete` eliminará los items especificados del mapa en memoria de la colección solamente.
    -   **Uso**:

        ```ts
        // Eliminar un solo item
        await collection.delete(itemId);

        // Eliminar múltiples items
        await collection.delete([itemId1, itemId2, itemId3]);
        ```

    -   **Valor de Retorno**: Retorna una promesa que se resuelve a un array de booleans, indicando el éxito de cada operación de eliminación.
