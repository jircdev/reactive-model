# Guía de Testing

Esta guía explica cómo ejecutar y escribir tests para `@beyond-js/reactive`.

## Estructura de Tests

Los tests están organizados en dos categorías:

```
src/
├── __tests__/
│   ├── source/              # Tests sobre código fuente (desarrollo rápido)
│   │   ├── model.test.ts
│   │   ├── item.test.ts
│   │   └── collection.test.ts
│   └── bundles/             # Tests sobre bundles compilados (validación de build)
│       ├── model.test.ts
│       ├── item.test.ts
│       └── collection.test.ts
```

## Ejecutar Tests

### Todos los Tests

```bash
# Ejecutar todos los tests (código fuente)
npm test

# Ejecutar todos los tests con watch mode
npm run test:watch

# Ejecutar con cobertura
npm run test:coverage
```

### Tests por Categoría

```bash
# Solo tests sobre código fuente (rápido, para desarrollo)
npm run test:source

# Solo tests sobre bundles (requiere build previo)
npm run build && npm run test:bundles
```

### Tests por Módulo

```bash
# Tests de ReactiveModel
npm run test:model

# Tests de Item
npm run test:item

# Tests de Collection
npm run test:collection
```

## Escribir Nuevos Tests

### Tests sobre Código Fuente

Los tests en `__tests__/source/` importan directamente desde el código fuente:

```typescript
import { ReactiveModel } from '@beyond-js/reactive/model';

describe('Mi Test', () => {
  test('debe funcionar', () => {
    const model = new ReactiveModel({ properties: ['id'] });
    expect(model).toBeDefined();
  });
});
```

**Ventajas:**
- Ejecución rápida (no requiere build)
- Mejor para desarrollo iterativo
- Depuración más fácil

### Tests sobre Bundles

Los tests en `__tests__/bundles/` importan desde los bundles compilados:

```typescript
import { ReactiveModel } from '@beyond-js/reactive/model';

describe('Mi Test Bundle', () => {
  test('debe funcionar desde bundle', () => {
    const model = new ReactiveModel({ properties: ['id'] });
    expect(model).toBeDefined();
  });
});
```

**Ventajas:**
- Valida el proceso de build
- Prueba lo que realmente se publica
- Detecta problemas de empaquetado

**Importante:** Requiere ejecutar `npm run build` antes de ejecutar estos tests.

## Casos de Prueba por Módulo

### ReactiveModel

Tests cubren:
- ✅ Instanciación básica
- ✅ Definición de propiedades reactivas
- ✅ Método `set()` y eventos
- ✅ Método `getProperty()` y acceso directo
- ✅ Método `getProperties()`
- ✅ Validación con Zod
- ✅ Estados: `ready`, `isDraft`, `unpublished`
- ✅ Métodos: `revert()`, `saveChanges()`
- ✅ Eventos: `change`, `{prop}.changed`

### Item

Tests cubren:
- ✅ Instanciación con entity
- ✅ Registro en RegistryFactory
- ✅ Método `load()` con provider mock
- ✅ Método `publish()` con provider mock
- ✅ Método `delete()` con provider mock
- ✅ Estados: `fetched`, `found`, `deleted`
- ✅ Integración con Registry
- ✅ Eventos específicos de Item

### Collection

Tests cubren:
- ✅ Instanciación con entity e item class
- ✅ Método `load()` con provider mock
- ✅ Gestión de items (addItems, setItems)
- ✅ Paginación (getTotal, getNext)
- ✅ Filtrado (matchesFilters)
- ✅ Método `delete()` múltiple
- ✅ Integración con RegistryFactory
- ✅ Eventos: `load`, `items.changed`

## Mocks y Fixtures

### Mock de Provider

```typescript
class MockProvider implements IEntityProvider {
  async load(specs?: any): Promise<any> {
    return { id: '1', name: 'Test' };
  }

  async publish(data: any): Promise<{ status: number; data: any }> {
    return { status: 200, data };
  }

  async delete(specs?: any): Promise<boolean> {
    return true;
  }
}
```

### Uso de Mocks

```typescript
const provider = new MockProvider(mockData);
const item = new MyItem({ id: '1' });
(item as any)._provider = provider; // Asignar provider para testing
```

## Buenas Prácticas

1. **Nombres descriptivos**: Usa nombres claros para tests y describe blocks
2. **Un test, una cosa**: Cada test debe verificar una funcionalidad específica
3. **Arrange-Act-Assert**: Organiza tus tests en estas tres secciones
4. **Mocks apropiados**: Usa mocks para dependencias externas
5. **Limpieza**: Asegúrate de limpiar estado entre tests si es necesario

## Ejemplo Completo

```typescript
import { Item, IEntityProvider, IItem } from '@beyond-js/reactive/entities/item';

interface IUser extends IItem {
  name: string;
  email: string;
}

class MockProvider implements IEntityProvider {
  async load(): Promise<any> {
    return { id: '1', name: 'John', email: 'john@example.com' };
  }
}

describe('User Item', () => {
  class User extends Item<IUser, MockProvider> {
    constructor(specs: any = {}) {
      super({
        entity: 'users',
        provider: MockProvider,
        properties: ['id', 'name', 'email'],
        ...specs,
      });
    }
  }

  test('debe cargar datos correctamente', async () => {
    const provider = new MockProvider();
    const user = new User({ id: '1' });
    (user as any)._provider = provider;

    await user.load();

    expect(user.getProperty('name')).toBe('John');
    expect(user.fetched).toBe(true);
  });
});
```

## Troubleshooting

### Error: "Cannot find module '@beyond-js/reactive/model'"

**Para tests sobre código fuente:**
- Verifica que `jest.config.js` tenga el `moduleNameMapper` correcto
- Asegúrate de estar ejecutando desde el directorio `src/`

**Para tests sobre bundles:**
- Ejecuta `npm run build` primero
- Verifica que `dist/` contenga los bundles generados

### Tests fallan con imports de bundles

- Asegúrate de haber ejecutado `npm run build`
- Verifica que los bundles se generaron correctamente en `dist/`
- Usa `jest.config.bundles.js` para tests de bundles

### Problemas con TypeScript

- Verifica que `ts-jest` esté instalado
- Revisa la configuración en `jest.config.js`
- Asegúrate de que los tipos estén disponibles

## Integración Continua

Para CI/CD, se recomienda:

```bash
# Build y tests en CI
npm run build
npm run test:bundles  # Validar bundles
npm run test:source   # Tests rápidos
npm run test:coverage # Reporte de cobertura
```

## Recursos

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [ts-jest Documentation](https://kulshekhar.github.io/ts-jest/)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)

