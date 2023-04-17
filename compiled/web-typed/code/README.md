# @beyond-js/reactive

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Deno JS](https://img.shields.io/badge/deno%20js-000000?style=for-the-badge&logo=deno&logoColor=white)
![Bun](https://img.shields.io/badge/Bun-%23000000.svg?style=for-the-badge&logo=bun&logoColor=white)
![Browser](https://img.shields.io/badge/Browser-4285F4?style=for-the-badge&logo=GoogleChrome&logoColor=white)

ReactiveModel is a class that allows you to create reactive objects that can be observed for changes. It can be used in any JavaScript environment and is agnostic to any framework.



Installation
To install ReactiveModel, you can use your favorite package manager. For example, with npm:

```
npm install @beyond-js/reactive
```

## Usage

To create a new `ReactiveModel`, simply instantiate the class with the desired properties:

```
import { ReactiveModel } from "@beyond-js/reactive";

interface Person {
  name: string;
  age: number;
}

const person = new ReactiveModel<Person>({
  name: "Alice",
  age: 25,
});

person.set("name", "Bob");
console.log(person.get("name")); // "Bob"
```
You can also use the `@reactiveProps` decorator to automatically create reactive properties:

```
import { ReactiveModel, reactiveProps } from "reactive";

interface Person {
  name: string;
  age: number;
}

class PersonModel extends ReactiveModel<Person> {
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

### License
ReactiveModel is licensed under the MIT License. See the LICENSE file for details.