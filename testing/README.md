# @beyond-js/reactive - Testing Package

Este es un paquete de prueba para validar el funcionamiento de `@beyond-js/reactive` con React y Vite.

## 🚀 Inicio Rápido

### Instalación

```bash
npm install
```

### Desarrollo

```bash
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

## 📦 Dependencias

- **@beyond-js/reactive**: La librería reactiva (versión 2.2.0+)
- **React**: Framework de UI
- **Vite**: Build tool y dev server
- **TypeScript**: Tipado estático

## 🎯 Características

Este paquete de prueba demuestra:

- ✅ Uso de `Collection` para gestionar listas de productos
- ✅ Uso de `Item` para entidades individuales
- ✅ Filtrado reactivo de productos por categoría
- ✅ Integración con React hooks (`useState`, `useEffect`)
- ✅ Eventos reactivos (`on`, `off`)
- ✅ Provider personalizado para simular carga de datos

## 📝 Notas

- Actualmente está configurado para usar la versión local del paquete desde `../src`
- Para usar la versión publicada en npm, actualiza `package.json`:
  ```json
  "@beyond-js/reactive": "^2.2.0"
  ```

