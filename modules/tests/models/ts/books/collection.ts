import { Collection } from "@beyond-js/reactive/entities";
import { Book } from "./index";

interface IUsers {
	items: Book[];
}
export /*bundle*/ class Books extends Collection {
	item = Book;
	protected storeName = "books";
	protected db = "test";

	constructor() {
		super();
		this.provider = new UserProvider();
		this.init();
	}
}
