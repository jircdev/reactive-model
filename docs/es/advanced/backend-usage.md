# Uso en Backend

ReactiveModel está diseñado para funcionar sin problemas tanto en frontend como en backend. Esta guía cubre cómo usar ReactiveModel en Node.js, Bun, Deno y otros entornos del lado del servidor.

## Por qué Usar ReactiveModel en Backend

1. **Código Universal/Isomórfico** - Comparte la lógica de dominio entre cliente y servidor
2. **Arquitectura Orientada a Eventos** - Pub/sub incorporado para backends reactivos
3. **Diseño Orientado al Dominio** - Items y Collections mapean naturalmente a conceptos de DDD
4. **Estado de WebSocket** - Perfecto para manejar estado de conexiones en tiempo real
5. **Caché en Memoria** - El Registry proporciona patrón Identity Map out of the box

## Configuración Básica

```typescript
// Importar de la misma manera que en frontend
import { ReactiveModel } from 'reactive/model';
import { Item } from 'reactive/entities/item';
import { Collection } from 'reactive/entities/collection';
```

## Arquitectura de Código Universal

La clave para código universal es separar la lógica de dominio (compartida) del acceso a datos (específico del entorno).

### Estructura del Proyecto

```
/packages
  /core                      # Lógica de dominio compartida (universal)
    /entities
      /user
        types.ts             # Interface IUser
        item.ts              # Clase User (sin provider hardcodeado)
        collection.ts        # Clase Users
  
  /client                    # Específico del frontend
    /providers
      user.provider.ts       # UserBrowserProvider (fetch API)
  
  /server                    # Específico del backend
    /providers
      user.provider.ts       # UserPrismaProvider
```

## Beneficios para Agentes de IA

Usar ReactiveModel en backend proporciona ventajas significativas para el desarrollo asistido por IA:

1. **Estructura Predecible** - Los agentes pueden entender y generar código siguiendo patrones consistentes
2. **Interfaces Compartidas** - Las definiciones de tipos se comparten, reduciendo errores
3. **Validación Consistente** - Los esquemas Zod funcionan idénticamente en cliente y servidor
4. **Arquitectura Basada en Eventos** - Fácil de entender y extender

Para más detalles, consulta la [documentación en inglés](../en/backend-usage.md).
