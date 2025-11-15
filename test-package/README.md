# Test Package - @beyond-js/reactive

Este es un paquete de prueba simple para validar que `@beyond-js/reactive` funciona correctamente como dependencia local.

## Estructura

```
test-package/
├── package.json      # Configuración con dependencia local
├── index.js          # Aplicación de prueba (Node.js)
├── index.html        # Página HTML de ejemplo (requiere bundler para navegador)
└── README.md         # Este archivo
```

## Instalación

```bash
cd test-package
npm install
```

Esto instalará `@beyond-js/reactive` desde `../src` como dependencia local.

## Ejecución

### Node.js (Recomendado)

```bash
npm start
# o
node index.js
```

Esto mostrará los productos en la consola con formato de tabla.

### Navegador

Para ver la página HTML funcionando:

```bash
# Opción 1: Usar http-server (recomendado)
npm run serve
# Esto servirá desde la raíz del proyecto

# Opción 2: Manualmente
# 1. Desde la raíz del proyecto, ejecuta:
cd ..
npx http-server . -p 8080 --cors

# 2. Luego abre en el navegador:
# http://localhost:8080/test-package/index.html

# Opción 3: Con Python
cd ..
python -m http.server 8080
# Luego abre: http://localhost:8080/test-package/index.html
```

**Nota:** 
- El servidor debe ejecutarse desde la **raíz del proyecto** (no desde `test-package/`) para que las rutas de los bundles funcionen correctamente.
- Necesitas un servidor HTTP local porque los módulos ES6 requieren CORS. No puedes abrir el archivo directamente con `file://`.

## Qué hace

1. **Crea una colección de productos** con datos de ejemplo
2. **Carga todos los productos** desde el provider mock
3. **Muestra los productos** en formato tabla
4. **Filtra productos** por categoría y precio
5. **Demuestra acceso directo** a propiedades (`product.name`)
6. **Demuestra acceso dinámico** usando `getProperty()`

## Datos de ejemplo

El paquete incluye 8 productos de ejemplo en diferentes categorías:
- Electronics (Laptops, iPhone, TV)
- Audio (Headphones, AirPods)
- Gaming (Nintendo Switch, PlayStation 5)

## Validación

Este paquete valida:
- ✅ Instalación de dependencia local
- ✅ Importación de bundles (`@beyond-js/reactive/entities/collection`)
- ✅ Creación de Items y Collections
- ✅ Carga de datos desde provider
- ✅ Filtrado de datos
- ✅ Acceso directo a propiedades
- ✅ Acceso dinámico con `getProperty()`

