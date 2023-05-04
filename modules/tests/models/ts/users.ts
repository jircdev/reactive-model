import { Collection } from "@beyond-js/reactive/entities";
import { User } from "./user";
import { UserProvider } from "@beyond-js/reactive/tests/backend/provider";
interface IUsers {
  items: User[];
}
export /*bundle*/ class Users extends Collection {
  item = User;
  protected storeName = "user";
  protected db = "test";
  protected localdb = false;
  constructor() {
    super();
    this.provider = new UserProvider();
    this.init();
  }
}
