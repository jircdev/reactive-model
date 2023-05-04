import { Item } from "@beyond-js/reactive/entities";
import { UserProvider } from "@beyond-js/reactive/tests/backend/provider";
interface IUser {
  name?: string;
  password: string;
  lastnames: string;
}

export /*bundle */
class User extends Item<IUser> {
  protected properties = ["id", "name", "lastname"];

  protected storeName = "user";
  protected db = "test";

  constructor({ id = undefined } = {}) {
    super();

    this.init({ id });
  }
}
