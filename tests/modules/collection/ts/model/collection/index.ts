import { Collection } from "@beyond-js/reactive/entities/collection";
import { User } from "../item";
import { CollectionProvider } from "./provider";

export class TestCollection extends Collection<User, CollectionProvider> {
  constructor() {
    super({
      entity: "User",
      item: User,
      provider: CollectionProvider,
      nextParamName: "start",
    });
    console.log(0.1, "instance");
  }

  async load(args?: { update?: boolean }) {
    console.log(1, args);
    const data = await super.load(args);
    return data;
  }
}

globalThis.Collection = TestCollection;
console.log(`Collection is being exposed as Collection in globaThis`);
