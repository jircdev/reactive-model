# AGENTS.md - Guía para Agentes AI

Este documento proporciona información esencial para agentes AI (como Cursor, GitHub Copilot, etc.) que trabajan con este proyecto.

## 📋 Información del Proyecto

**Nombre:** `@beyond-js/reactive`  
**Tipo:** Librería TypeScript  
**Versión:** 2.1.4  
**Descripción:** Librería reactiva para gestión de datos con soporte para Items, Collections y modelos reactivos.

## 🏗️ Estructura del Proyecto

```
reactive-model/
├── src/                          # Código fuente principal
│   ├── modules/                  # Módulos de la librería
│   │   ├── model/                # ReactiveModel (bundle: model)
│   │   ├── entities/
│   │   │   ├── item/             # Item (bundle: entities/item)
│   │   │   └── collection/       # Collection (bundle: entities/collection)
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

El proyecto genera **3 bundles independientes**:

1. **`model`** - Clase base `ReactiveModel`
2. **`entities/item`** - Clase `Item` para entidades individuales
3. **`entities/collection`** - Clase `Collection` para grupos de items

**Importante:** Los bundles son independientes. Cada uno puede importarse por separado y mantiene sus dependencias internas como externas.

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

- `@beyond-js/events` - Sistema de eventos
- `uuid` - Generación de IDs
- `zod` - Validación

### Desarrollo

- `rollup` - Bundler
- `@rollup/plugin-typescript` - Plugin TypeScript para Rollup
- `rollup-plugin-dts` - Generación de tipos
- `typescript` - Compilador TypeScript
- `jest` - Framework de testing
- `ts-jest` - Preset Jest para TypeScript

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

- Usar `export /*bundle*/` para clases/interfaces principales
- Mantener magic comments para compatibilidad

### Imports

- **Siempre** usar bare specifiers: `@beyond-js/reactive/model`
- **Nunca** usar imports relativos entre bundles

### TypeScript

- Target: ES2018
- Module: ESNext
- Strict: false (compatibilidad con código existente)

### Tests

- Tests sobre código fuente: `__tests__/source/`
- Tests sobre bundles: `__tests__/bundles/`
- Un archivo de test por módulo
- Usar mocks para providers

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

- `src/rollup.config.js` - Configuración de bundles
- `src/tsconfig.json` - Configuración TypeScript
- `src/package.json` - Exports y scripts

### Tests

- `src/jest.config.js` - Configuración tests código fuente
- `src/jest.config.bundles.js` - Configuración tests bundles
- `src/__tests__/source/` - Tests sobre código fuente
- `src/__tests__/bundles/` - Tests sobre bundles

### Documentación

- `src/TESTING.md` - Guía de testing
- `AGENTS.md` - Este archivo
- `docs/` - Documentación de usuario

## 🐛 Troubleshooting Común

### Build falla

1. Verificar que todas las dependencias estén instaladas: `npm install`
2. Verificar que `tsconfig.json` esté correcto
3. Verificar que `rollup.config.js` tenga las rutas correctas

### Tests fallan

**Tests sobre código fuente:**
- Verificar `jest.config.js` y `moduleNameMapper`
- Asegurarse de estar en directorio `src/`

**Tests sobre bundles:**
- Ejecutar `npm run build` primero
- Verificar que `dist/` contenga bundles generados
- Usar `jest.config.bundles.js`

### Imports no resuelven

- Verificar que se usen bare specifiers: `@beyond-js/reactive/model`
- Verificar `moduleNameMapper` en configuración Jest
- Verificar `exports` en `package.json`

## 📚 Recursos Adicionales

- **Testing:** Ver `src/TESTING.md`
- **Documentación Usuario:** Ver `docs/en/README.md`
- **Contribución:** Ver `contributing.md`

## 🔗 Exports del Paquete

El paquete exporta 3 bundles:

```json
{
  "./model": {
    "types": "./dist/model/index.d.ts",
    "import": "./dist/model/index.mjs",
    "require": "./dist/model/index.cjs"
  },
  "./entities/collection": {
    "types": "./dist/entities/collection/index.d.ts",
    "import": "./dist/entities/collection/index.mjs",
    "require": "./dist/entities/collection/index.cjs"
  },
  "./entities/item": {
    "types": "./dist/entities/item/index.d.ts",
    "import": "./dist/entities/item/index.mjs",
    "require": "./dist/entities/item/index.cjs"
  }
}
```

## 💡 Tips para Agentes AI

1. **Siempre verificar estructura de bundles** antes de hacer cambios
2. **Mantener compatibilidad** - no romper exports existentes
3. **Ejecutar tests** después de cambios significativos
4. **Validar build** antes de sugerir cambios grandes
5. **Consultar TESTING.md** para entender cómo escribir tests
6. **Mantener magic comments** y `module.json` para compatibilidad

## 🎓 Contexto Histórico

Este proyecto fue migrado de **beyond.js** a un sistema de build estándar con **Rollup**. Se mantiene compatibilidad con beyond.js mediante:
- Magic comments `/*bundle*/`
- Archivos `module.json`
- Estructura de bundles independientes
- Bare specifiers en imports

La migración permite:
- Build sin dependencia de beyond.js
- Generación de tipos TypeScript estándar
- Tests independientes
- Misma estructura de exports

