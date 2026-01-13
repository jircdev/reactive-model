# Create Custom Adapter

## Introduction

Creating a custom adapter allows you to define your own logic for data serialization/deserialization, giving you more
control and flexibility over how data is handled in your ReactiveModel instances.

## Steps to Create a Custom Adapter

### 1. Implement the `IResponseAdapter` Interface

First, create a new class that implements the `IResponseAdapter` interface:

```typescript
class MyCustomAdapter implements IResponseAdapter {
	toClient(data: any): any {
		// Transform data to client format
		return data;
	}

	fromRemote(data: any): any {
		// Transform data received from remote API
		return data;
	}

	fromRemoteList(data: any): any {
		// Transform list data received from remote API
		return data;
	}
}
```

### 2. Use the Custom Adapter

#### Global Scope

To set the custom adapter as the default for all instances:

```typescript
import { ReactiveConfig } from 'reactive/settings';

ReactiveConfig.set({
	adapter: MyCustomAdapter,
});
```

#### Per Instance Scope

To use the custom adapter for specific `Item` or `Collection` instances:

```typescript
class CustomItem extends Item {
	constructor(specs) {
		super({ ...specs, adapter: MyCustomAdapter });
	}
}

class CustomCollection extends Collection {
	constructor(specs) {
		super({ ...specs, adapter: MyCustomAdapter });
	}
}
```
