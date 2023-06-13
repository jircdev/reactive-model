# @beyond-js/reactive

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Deno JS](https://img.shields.io/badge/deno%20js-000000?style=for-the-badge&logo=deno&logoColor=white)
![Bun](https://img.shields.io/badge/Bun-%23000000.svg?style=for-the-badge&logo=bun&logoColor=white)
![Browser](https://img.shields.io/badge/Browser-4285F4?style=for-the-badge&logo=GoogleChrome&logoColor=white)



`@beyond-js/reactive` is a powerful TypeScript library designed to provide a reactive data layer for your application. By offering tools to create and manage reactive data structures, it enables developers to construct performant and scalable applications with ease. It enhances data-driven views or components by reacting to changes and keeping everything in sync.

## Main Objects

The library offers three main objects - ReactiveModel, Collection, and Item - each serving a distinct purpose in the reactive data layer.

### 1. [ReactiveModel](./docs/model.md)

ReactiveModel is a TypeScript class designed to create reactive properties that can trigger events when they change. It makes use of the Observable pattern to notify subscribers whenever a change is made to the model's properties. It's especially useful in contexts where data-driven views or components are used.

### 2. [Collection](./docs/collection.md)

Collection is a reactive data structure designed to handle a set of Items. It extends the ReactiveModel and provides methods for managing a collection of reactive objects. It can load, save, and sync items with both a local database and a remote server.

### 3. [Item](./docs/item.md)

Item is an abstract class that represents a "reactive" object in your application. It extends the ReactiveModel, meaning it can handle changes in its properties and automatically update other parts of the code. Item includes methods for saving, publishing, and syncing data between a local database (like IndexedDB) and an external server.

## Installation

To add `@beyond-js/reactive` to your project, run:

```
npm install @beyond-js/reactive
```

For more detailed information about the library and how to use it, refer to the individual READMEs of [ReactiveModel](./docs/model/README.md), [Collection](./docs/collection/README.md), and [Item](./docs/item/README.md). 

## Contributions

Contributions, issues, and feature requests are welcome. Feel free to check the [issues page](#) or open a new one.

## License

This project is [MIT](./LICENSE) licensed.