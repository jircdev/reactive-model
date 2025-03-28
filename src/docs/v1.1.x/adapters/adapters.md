# Adapters in ReactiveModel

## Overview

Adapters in ReactiveModel are designed to handle the transformation and standardization of data when interacting with
remote services or APIs. They come in three types:

1. **Legacy**: The original adapter, designed to work with older configurations.
2. **Default**: A built-in standard adapter that follows common best practices.
3. **Custom**: User-defined adapters that implement the `IResponseAdapter` interface for specialized use-cases.

## Adapter Scope

ReactiveModel allows you to specify adapters in two scopes:

### Global Scope

You can set a global adapter using the `ReactiveConfig` class. This adapter will be used by all instances of your
ReactiveModels unless overridden.

### Per Instance Scope

You can specify an adapter for individual `Item` or `Collection` instances by passing the adapter in the constructor.

```typescript
// For Item
class OwnItem extends Item {
	constructor(specs) {
		super({ ...specs, adapter: CustomAdapter });
	}
}

// For Collection
class CustomCollection extends Collection {
	constructor(specs) {
		super({ ...specs, adapter: CustomAdapter });
	}
}
```

If no adapter is specified, ReactiveModel will use the global adapter set via `ReactiveConfig`.

## Links

-   [Create Custom Adapter](./create-custom-adapter.md)
