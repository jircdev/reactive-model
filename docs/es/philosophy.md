# Filosofía y Visión

## Los Datos Primero, Independencia de Frameworks

`reactive` se basa en la convicción de que **la lógica de negocio pertenece a los datos**, no a los componentes de la interfaz de usuario (UI). En el desarrollo frontend moderno, a menudo filtramos validaciones complejas, gestión de relaciones y lógica de estado dentro de nuestros componentes React o gestores de estado de UI como Zustand o Redux.

Esta librería proporciona una **Capa de Inteligencia de Datos** dedicada que maneja la "verdad" de tu aplicación, mientras que tus herramientas de UI favoritas manejan la "presentación".

### ¿Por qué ReactiveModel?

1.  **Verdad Centralizada**: La validación (vía Zod), los valores por defecto y las propiedades computadas se definen una vez en el modelo, no se repiten en los componentes.
2.  **Agnóstico por Diseño**: Funciona perfectamente con React, Vue, Svelte, o incluso en entornos Node.js. No compite con Zustand o Redux; los complementa manejando la lógica de dominio.
3.  **Reactividad Predictible**: Los eventos de grano fino permiten que la UI reaccione solo cuando cambian propiedades específicas, evitando renderizados innecesarios.

---

## El Impacto de la IA: Por qué a los Agentes de IA les encanta esta librería

Los agentes de Inteligencia Artificial (como Cursor, Copilot o agentes de codificación especializados) rinden exponencialmente mejor cuando el código tiene una **estructura clara y contratos explícitos**.

### 1. Estructura Autodocumentada
Cuando una IA lee un `ReactiveModel` o `Item`, entiende inmediatamente:
-   Exactamente qué propiedades existen.
-   Las reglas de validación (gracias a Zod).
-   Las relaciones entre entidades (propiedades anidadas).

### 2. Reducción de Alucinaciones
Los agentes de IA a menudo adivinan cómo actualizar el estado o dónde encontrar una lógica específica. Con `reactive`, la lógica está encapsulada en el modelo. La IA no necesita "inventar" una forma de guardar un usuario; simplemente llama a `user.publish()`.

### 3. Intención Clara
Debido a que los modelos emiten eventos específicos (ej. `name.changed`), la IA puede razonar sobre los efectos secundarios de una acción sin tener que rastrear flujos de estado de UI complejos.

---

## Coexistencia con Gestores de Estado (ej. Zustand)

Uno de los mayores conceptos erróneos es que debes elegir entre un gestor de estado y un modelo reactivo. **No es así.**

-   **Zustand/Redux**: Úsalos para el **Estado de UI** (¿está abierta la barra lateral?, ¿qué pestaña está activa?, filtro de búsqueda actual).
-   **ReactiveModel**: Úsalo para los **Datos de Dominio** (¿es válido el precio del producto?, ¿cuántos artículos hay en el carrito?, guardar el perfil de usuario).

**Patrón**: Puedes almacenar una instancia de `ReactiveModel` dentro de un store de Zustand. Zustand maneja el acceso global, mientras que el modelo maneja la inteligencia y consistencia de los datos.
