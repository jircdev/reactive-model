# Inicio Rápido

Configura y usa `@beyond-js/reactive` en menos de 2 minutos.

## 1. Instalación

Instala el paquete y su dependencia `zod`:

```bash
npm install @beyond-js/reactive zod
```

## 2. Tu Primer Modelo Reactivo

`ReactiveModel` es la clase base para crear objetos reactivos con validación.

```typescript
import { ReactiveModel } from '@beyond-js/reactive/model';
import { z } from 'zod';

interface IUser {
  name: string;
  age: number;
}

class User extends ReactiveModel<IUser> {
  // Usa 'declare' para propiedades con tipos seguros
  declare name: string;
  declare age: number;

  constructor(data: Partial<IUser> = {}) {
    super({
      // Define qué propiedades son reactivas
      properties: ['name', 'age'],
      ...data
    });

    // Opcional: Define un esquema de validación
    this.schema = z.object({
      name: z.string().min(2),
      age: z.number().min(18)
    });
  }
}
```

## 3. Uso

```typescript
const user = new User({ name: 'John', age: 25 });

// 1. Escuchar cambios específicos
user.on('name.changed', ({ value, previous }) => {
  console.log(`Nombre cambió de ${previous} a ${value}`);
});

// 2. Evento de cambio global
user.on('change', () => {
  console.log('El modelo User fue actualizado');
});

// 3. Actualizar propiedades
user.name = 'Jane'; // Dispara eventos

// 4. Actualizaciones por lote con validación
const result = user.set({ name: 'J', age: 10 });
if (!result.valid) {
  console.log('Errores:', result.errors);
}
```

## Siguientes Pasos

-   **[Aprende sobre Items](./entities/item.md)**: Gestiona entidades individuales con IDs y persistencia.
-   **[Explora Colecciones](./entities/collection.md)**: Gestiona grupos de items con filtrado y paginación.
-   **[Estructuras Reactivas](./structures/reactive-map.md)**: Usa ReactiveMap, ReactiveArray o ReactiveTree para datos especializados.
