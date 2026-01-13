# ReactiveModel Configuration Documentation

## Setting General Configurations

The `ReactiveConfig` class in ReactiveModel allows you to set global configurations that will be applicable for all
instances of ReactiveModel. This can be particularly useful for setting up a default or custom adapter for handling data
serialization/deserialization.

## Importing the Settings Module

To access the `ReactiveConfig` class, you should import it from the package as follows:

```typescript
import { ReactiveConfig } from 'reactive/settings';
```

## Interfaces

### `IResponseAdapter`

This interface outlines the required methods for a custom adapter.

```typescript
interface IResponseAdapter {
	toClient: (data: any) => any;
	fromRemote: (data: any) => any;
	fromRemoteList?: (data: any) => any;
}
```

-   **`toClient`**: Transforms data to be sent to the client.
-   **`fromRemote`**: Transforms single-item data received from remote API.
-   **`fromRemoteList`**: Transforms list data received from remote API.

### `IConfig`

This interface outlines the structure of the configuration object.

```typescript
type TCustomAdapter = new () => IResponseAdapter;

export interface IConfig {
	adapter: 'legacy' | 'default' | TCustomAdapter;
}
```

-   **`adapter`**: Specifies which adapter to use ('legacy', 'default', or a custom adapter class).

## Class Structure

```typescript
export class ReactiveConfig {
	static #config: IConfig;
	static adapter = 'legacy';

	static set(config: IConfig) {
		this.#config = config;
		const properties = Object.keys(config);
		properties.forEach(property => {
			ReactiveConfig[property] = config[property];
		});
	}
}
```

## Usage

To set the configuration, you can use the `set` method of `ReactiveConfig`. The `set` method takes an object conforming
to the `IConfig` interface.

```typescript
ReactiveConfig.set({
	adapter: 'default',
});
```

or with a custom adapter:

```typescript
class CustomAdapter implements IResponseAdapter {
	/* implementations */
}

ReactiveConfig.set({
	adapter: CustomAdapter,
});
```

This will apply the configurations globally across all instances of `ReactiveModel`.

## Conclusion

Using the `ReactiveConfig` class to set global configurations provides a centralized way to manage important aspects of
your ReactiveModel instances.
