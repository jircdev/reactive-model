import { Collection } from "@beyond-js/reactive/entities";
import { User } from "./index";
import { UserProvider } from "@beyond-js/reactive/tests/backend/provider";
interface IUsers {
	items: User[];
}
export /*bundle*/ class Users extends Collection {
	item = User;
	protected storeName = "user";
	protected db = "test";

	constructor() {
		super();
		this.provider = new UserProvider();
		this.init();
	}
}
