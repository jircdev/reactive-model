# Guía de Integración: React & Zustand

`reactive` es agnóstico al framework. No reemplaza tus herramientas de gestión de estado de UI como Zustand, Redux o React Context; las complementa proporcionando una capa robusta para la **Lógica de Negocio e Inteligencia de Datos**.

## Separación de Responsabilidades

Para construir aplicaciones escalables, recomendamos separar el **Estado de UI** de los **Datos de Dominio**:

| Capa | Responsabilidad | Herramienta Recomendada |
|-------|----------------|-------------------------|
| **Estado de UI** | Modales, pestañas, filtros de búsqueda, estados de carga, tema. | Zustand, Redux, `useState`. |
| **Datos de Dominio** | Lógica de negocio, validación, relaciones, persistencia. | `reactive` (Items, Collections). |

---

## Integración con Zustand

Zustand es excelente para el acceso al estado global. Puedes almacenar tus instancias de Reactive Model directamente dentro de un store de Zustand.

### 1. Define tu Modelo Reactivo

```typescript
import { Item } from 'reactive/entities/item';

export class UserProfile extends Item<IUser> {
  constructor() {
    super({
      entity: 'users',
      properties: ['name', 'email', 'avatar'],
      // ...
    });
  }
}
```

### 2. Crea un Store de Zustand

```typescript
import { create } from 'zustand';
import { UserProfile } from './models/user';

interface AuthStore {
  user: UserProfile | null;
  login: (data: any) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  login: (data) => set({ user: new UserProfile(data) }),
  logout: () => set({ user: null }),
}));
```

---

## Uso en Componentes React

Dado que `ReactiveModel` utiliza un sistema basado en eventos, puedes suscribirte a los cambios en tus componentes.

### Hook Personalizado para Suscripción

Recomendamos un hook simple para forzar un re-renderizado cuando el modelo cambie:

```typescript
import { useEffect, useState } from 'react';

export function useReactiveModel(model) {
  const [, setTick] = useState(0);

  useEffect(() => {
    if (!model) return;
    
    const handler = () => setTick(t => t + 1);
    model.on('change', handler);
    
    return () => model.off('change', handler);
  }, [model]);

  return model;
}
```

### Implementación en el Componente

```tsx
function ProfileHeader() {
  const user = useAuthStore(state => state.user);
  useReactiveModel(user); // Se re-renderiza cuando user.name o cualquier propiedad cambie

  if (!user) return null;

  return (
    <div>
      <h1>Bienvenido, {user.name}</h1>
      <input 
        value={user.name} 
        onChange={e => user.name = e.target.value} 
      />
      <button onClick={() => user.publish()}>Guardar</button>
    </div>
  );
}
```

## Beneficios de este Patrón

1.  **Lógica agnóstica al framework**: Tu lógica de negocio (validación, llamadas a API) está en la clase `UserProfile`, que puede usarse en Node.js u otros frameworks sin cambios.
2.  **Intención clara**: Al componente solo le importa "usar" los datos. El "cómo" (guardar, validar) está oculto en el modelo.
3.  **Rendimiento**: Puedes escuchar cambios en propiedades específicas (ej. `user.on('avatar.changed', ...)`) para un control aún más granular.
4.  **Amigable con la IA**: Un agente de IA puede generar fácilmente una nueva interfaz para tu `UserProfile` porque el modelo define exactamente qué es posible y válido.
