# How to use.

This environment test uses web and backend environments. What means that requires to execute a node service to integrate
a backend connection and be able to have a SQLite database connection.

## BeyondJS bundle imports in tests

When writing Jest tests that rely on modules from this package, point `@beyond-js/bee` to the development bundler URL
(`http://localhost:2490`). Imports can then omit the package version:

```js
const BEE = require('@beyond-js/bee');
BEE('http://localhost:2490', {});

const { Item } = await bimport('@beyond-js/reactive/entities/item');
```

Using the bundler port keeps tests aligned with the sources under `src/` and avoids hardcoding published versions.
