# @beyond-js/reactive

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Browser](https://img.shields.io/badge/Browser-4285F4.svg?style=for-the-badge&logo=GoogleChrome&logoColor=white)

`@beyond-js/reactive` es una potente librería TypeScript diseñada para proporcionar una **Capa de Inteligencia de Datos** para tu aplicación. Al centralizar la lógica de negocio, la validación y la reactividad dentro de tus estructuras de datos, permite a los desarrolladores construir aplicaciones escalables y agnósticas al framework que son increíblemente fáciles de entender y mantener para agentes de IA.

---

## 🧭 Ruta de Aprendizaje

Elige tu camino para dominar `@beyond-js/reactive`:

### 1. Visión y Conceptos Básicos
-   **[Filosofía y Visión](./philosophy.md)**: Por qué la lógica de negocio pertenece a los datos y cómo impacta en el desarrollo con IA.
-   **[Inicio Rápido](./getting-started.md)**: Instala y construye tu primer modelo en 2 minutos.

### 2. Fundamentos
-   **[ReactiveModel](./fundamentals/reactive-model.md)**: La clase base para todos los objetos reactivos.
-   **[Interfaces](./fundamentals/interfaces.md)**: Contratos unificados para el manejo polimórfico.

### 3. Entidades de Dominio
-   **[Items](./entities/items.md)**: Gestión de entidades individuales con IDs y ciclo de vida.
-   **[Colecciones](./entities/collections.md)**: Grupos de items con filtrado y paginación.
-   **[Propiedades Anidadas](./entities/nested-properties.md)**: Modelado de relaciones complejas.

### 4. Estructuras Reactivas
-   **[ReactiveMap](./structures/reactive-map.md)**: Almacenamiento reactivo clave-valor.
-   **[ReactiveArray](./structures/reactive-array.md)**: Métodos de array estándar con eventos reactivos.
-   **[ReactiveTree](./structures/reactive-tree.md)**: Gestión de datos jerárquicos.

### 5. Avanzado y Arquitectura
-   **[Guía de Integración (React & Zustand)](./architecture/integration-guide.md)**: Cómo coexistir con gestores de estado de UI.
-   **[Providers](./advanced/providers.md)**: Desacoplamiento del acceso a datos (APIs, Bases de Datos).
-   **[Plugins](./advanced/plugins.md)**: Extensión de funcionalidad con aspectos transversales.
-   **[Ejemplos Prácticos](./advanced/examples.md)**: Escenarios de implementación del mundo real.

---

## ✨ ¿Por qué elegir esta librería?

### 🎯 Lógica Centrada en los Datos
Deja de filtrar reglas de validación y negocio en tus componentes React. Defínelas una vez en tus modelos y úsalas en cualquier lugar (Frontend, Backend, Mobile).

### 🤖 Desarrollo Optimizado para IA
Los agentes de IA (Cursor, Copilot) rinden mejor cuando el código tiene una estructura explícita. El uso de Zod y la lógica encapsulada hace que esta librería sea autodocumentada para la IA.

### 🔌 Agnóstico al Framework
Compatible con React, Vue, Svelte o Node.js. No reemplaza a Zustand o Redux; maneja la capa de datos mientras ellos manejan el estado de la UI.

### ✅ Inteligencia Integrada
- **Validación con Zod**: Integración nativa de esquemas.
- **Seguimiento de Cambios**: Detecta automáticamente cambios no publicados.
- **Sistema de Eventos**: Reactividad de grano fino.

---

## 🚀 Fragmento de Inicio Rápido

```typescript
import { Item } from '@beyond-js/reactive/entities/item';

class Producto extends Item<IProduct> {
  constructor(data) {
    super({
      entity: 'products',
      properties: ['name', 'price'],
      ...data
    });
  }
}

const miProducto = new Producto({ name: 'Laptop', price: 999 });
miProducto.on('change', () => console.log('¡Actualizado!'));
miProducto.name = 'Pro Laptop'; // Dispara el evento
```

---

## 🤝 Comunidad y Soporte
- [CHANGELOG](./CHANGELOG.md)
- [Guía de Migración](./migration-v3.md)
- [Contribución](../../contributing.md)
