import { Item } from "@beyond-js/reactive-2/entities";
import { UserProvider } from "@beyond-js/reactive-2/tests/backend/provider";
interface IBook {
	name?: string;
	password: string;
	lastnames: string;
}

export /*bundle */
class Book extends Item<IBook> {
	protected properties = ["id", "title", "author", "year"];

	protected storeName = "book";
	protected db = "test";

	constructor({ id = undefined } = {}) {
		super();

		this.init({ id });
	}
}