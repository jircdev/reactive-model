# ReactiveModel 

ReactiveModel extends the Events class from @beyond-js/events/events package and makes use of the Observable pattern to notify subscribers whenever a change is made to the model's properties. It's designed to handle various stages of data processing, such as fetching, processing, and loading states.

## How it works

ReactiveModel is a class that allows you to create reactive objects that can be observed for changes. 
It can be used in any JavaScript environment and is agnostic to any framework.


Installation
To install ReactiveModel, you can use your favorite package manager. For example, with npm:

```
npm install @beyond-js/reactive
```

## Usage

To create a new `ReactiveModel`, simply instantiate the class with the desired properties:

```ts
import { ReactiveModel } from "@beyond-js/reactive/model";

interface IPerson {
  name: string;
  age: number;
}

const person = new ReactiveModel<IPerson>({
  name: "Alice",
  age: 25,
});

person.set("name", "Bob");
console.log(person.get("name")); // "Bob"



```
## Working with Reactive Properties

You can also use the `@reactiveProps` decorator to automatically create reactive properties:

```ts
import { ReactiveModel, reactiveProps } from "reactive";

interface IPerson {
  name: string;
  age: number;
}

class PersonModel extends ReactiveModel<IPerson> {
  @reactiveProps(["name", "age"])
  name!: string;

  age!: number;
}

const person = new PersonModel({
  name: "Alice",
  age: 25,
});

person.name = "Bob";
console.log(person.name); // "Bob"
```



### Setting and Getting Properties

You can use the set method to set the value of one or more properties:
```
const myModel = new MyModel();
myModel.set({ myProperty: 'newValue' });

```

And you can use the getProperties method to get all the properties of the model:

```
const properties = myModel.getProperties();
```

  ###  Notice
  This class is an abstract one. Meaning it should be extended before being used. All boolean properties in the class (fetching, fetched, processing, processed, loaded, ready) represent different states of data handling and processing. Users can use the state that suits their needs while processing data.



## API

`constructor(initialValues?: T)`
Creates a new ReactiveModel instance with the initial values.

`set(property: keyof T, value: T[keyof T]): void`
Sets the value of a property and triggers a change event if the value has changed.

`get(property: keyof T): T[keyof T]`
Gets the value of a property.

`getProperties(): Record<string, any>`
Returns an object with all the reactive properties and their current values.

`on(event: string, listener: ListenerFunction, priority?: number): this`
Binds an event handler to an event name.

`off(event: string, listener: ListenerFunction, force?: number): this`
Unbinds an event listener.

`trigger(event: Trigger, ...rest: any[]): any`
Triggers an event.

`destroy(): void`
Destroys the ReactiveModel instance and clears all listeners.
