# @beyond-js/reactive

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Deno JS](https://img.shields.io/badge/deno%20js-000000.svg?style=for-the-badge&logo=deno&logoColor=white)
![Bun](https://img.shields.io/badge/Bun-%23000000.svg?style=for-the-badge&logo=bun&logoColor=white)
![Browser](https://img.shields.io/badge/Browser-4285F4.svg?style=for-the-badge&logo=GoogleChrome&logoColor=white)

`@beyond-js/reactive` es una biblioteca TypeScript diseñada para proporcionar una capa de datos reactiva para tu aplicación. Al ofrecer herramientas para crear y gestionar estructuras de datos reactivas, permite a los desarrolladores construir aplicaciones performantes y escalables con facilidad. Mejora las vistas o componentes basados en datos reaccionando a cambios y manteniendo todo sincronizado.

Esta carpeta contiene la documentación completa sobre cómo funcionan los componentes principales del sistema Reactive
Model: **ReactiveModel**, **Items**, **Colecciones** y **Propiedades Anidadas**.

## ✨ ¿Por qué Reactive Model?

Reactive Model es una biblioteca que simplifica la gestión de datos reactivos en aplicaciones JavaScript/TypeScript.
Ofrece las siguientes características principales:

### 🎯 Gestión Simplificada de Datos

-   **Items**: Gestión completa del ciclo de vida de entidades individuales (carga, guardado, eliminación)
-   **Colecciones**: Gestión de grupos de items con filtrado, ordenamiento y paginación automática
-   **Propiedades Anidadas**: Modela relaciones complejas entre entidades de forma natural

### 📡 Sistema de Eventos Reactivos

-   **Eventos por propiedad**: Escucha cambios específicos (`user.on('name.changed', ...)`)
-   **Eventos globales**: Reacciona a cualquier cambio (`user.on('change', ...)`)
-   **Eventos personalizados**: Dispara tus propios eventos con `trigger()`
-   **Reactividad granular**: Actualizaciones precisas en la UI sin re-renderizados innecesarios

### ✅ Validación con Zod

-   **Integración nativa**: Define esquemas Zod usando un getter `schema`
-   **Validación automática**: Se valida automáticamente al actualizar propiedades
-   **Validación manual**: Valida datos sin actualizar usando `validate()`
-   **Mensajes personalizados**: Define mensajes de error específicos para cada regla

### 🔌 Desacoplamiento de Fuentes de Datos

-   **Providers**: Lógica de acceso a datos completamente separada del modelo
-   **Flexibilidad**: Funciona con cualquier fuente (REST APIs, GraphQL, IndexedDB, localStorage, etc.)
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

## 📚 Índice

### Fundamentos

-   [ReactiveModel](./reactive-model.md) - Clase base para modelos reactivos
-   [Items](./items.md) - Guía completa sobre cómo trabajar con items individuales
-   [Colecciones](./collections.md) - Guía completa sobre cómo trabajar con colecciones de items

### Temas Avanzados

-   [Propiedades Anidadas](./nested-properties.md) - Cómo implementar Items y Collections como propiedades
-   [Ejemplos Prácticos](./examples.md) - Ejemplos de uso real de items y colecciones

## 🎯 Conceptos Clave

### ReactiveModel

**ReactiveModel** es la clase base que proporciona la funcionalidad reactiva. Permite definir propiedades reactivas,
gestionar validación, manejar estados de ciclo de vida y trabajar con eventos.

### Items

Los **Items** representan entidades individuales reactivas (como un usuario, un producto, etc.) que pueden cargarse,
guardarse y eliminarse mediante proveedores de datos. Extienden `ReactiveModel` y se integran con un sistema de
registro.

### Colecciones

Las **Colecciones** representan grupos de items que pueden cargarse, filtrarse y gestionarse de forma reactiva. También
extienden `ReactiveModel` y proporcionan funcionalidades de paginación y filtrado.

### Propiedades Anidadas

Las **Propiedades Anidadas** permiten que un Item o ReactiveModel tenga otras instancias de Item o Collection como
propiedades, permitiendo modelar relaciones complejas entre entidades.

Ambos conceptos están diseñados para trabajar con **Providers** que manejan la lógica de acceso a datos (APIs, bases de
datos, etc.).

## 🚀 Inicio Rápido

### Item básico

```typescript
import { Item } from '@beyond-js/reactive/entities/item';

class User extends Item<IUser, UserProvider> {
	constructor() {
		super({
			entity: 'users',
			provider: UserProvider,
			properties: ['id', 'name', 'email'],
		});
	}
}

const user = new User({ id: '1' });
await user.load();

// Acceso directo a propiedades
console.log(user.name, user.email);

// Escuchar cambios
user.on('name.changed', ({ value }) => {
	console.log('Nombre cambió a:', value);
});

// Destructuración funciona normalmente
const { name, email } = user;
```

### Colección básica

```typescript
import { Collection } from '@beyond-js/reactive/entities/collection';

class Users extends Collection<User, UserProvider> {
	constructor() {
		super({
			entity: 'users',
			provider: UserProvider,
			item: User,
		});
	}
}

const users = new Users();
await users.load();

// Acceso directo a items
users.items.forEach(user => {
	console.log(user.name);
});

// Filtrado y búsqueda
await users.load({
	where: {
		name: { contains: 'Juan' },
		age: { gte: 18 },
	},
});
```

## 📖 Más Información

Para más detalles, consulta la documentación específica de cada componente:

### Fundamentos

-   [ReactiveModel - Documentación detallada](./reactive-model.md) - Clase base con todas sus características
-   [Items - Documentación detallada](./items.md) - Gestión de entidades individuales
-   [Colecciones - Documentación detallada](./collections.md) - Gestión de grupos de items

### Temas Avanzados

-   [Propiedades Anidadas - Documentación detallada](./nested-properties.md) - Items y Collections como propiedades
-   [Ejemplos prácticos](./examples.md) - Casos de uso reales y patrones comunes

## 🔗 Orden Recomendado de Lectura

Si eres nuevo en Reactive Model, te recomendamos leer la documentación en este orden:

1. **[ReactiveModel](./reactive-model.md)** - Comprende los fundamentos de la reactividad
2. **[Items](./items.md)** - Aprende a trabajar con entidades individuales
3. **[Colecciones](./collections.md)** - Aprende a gestionar grupos de items
4. **[Propiedades Anidadas](./nested-properties.md)** - Modela relaciones complejas
5. **[Ejemplos Prácticos](./examples.md)** - Ve ejemplos reales de implementación

## 📦 Instalación

Para agregar `@beyond-js/reactive` a tu proyecto, ejecuta:

```bash
npm install @beyond-js/reactive
```

## 🤝 Contribuir

¡Las contribuciones, issues y solicitudes de características son bienvenidas! Agradecemos tu interés en mejorar `@beyond-js/reactive`.

### Cómo Contribuir

1. **Fork el repositorio** y clónalo en tu máquina local:

```bash
git clone https://github.com/jircdev/reactive-model.git
cd reactive-model
```

2. **Instala las dependencias**:

```bash
# Para la biblioteca
npm install

# Para los tests
cd tests
npm install
```

3. **Crea una rama** para tu feature o fix:

```bash
git checkout -b feature/mi-nueva-caracteristica
```

4. **Ejecuta el servidor de desarrollo**:

```bash
beyond run
```

Accede al servidor en `http://localhost:950` para probar tus cambios.

5. **Ejecuta los tests** para asegurar que todo funciona:

```bash
cd tests
npm test
```

6. **Haz commit** de tus cambios y **envía un Pull Request** con una descripción clara de los cambios.

### Código de Conducta

Al participar en este proyecto, te comprometes a mantener un ambiente respetuoso y acogedor para todos los contribuyentes.

## 📄 Licencia

Este proyecto está licenciado bajo la [Licencia MIT](../src/LICENSE).

Copyright (c) @beyond-js

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
