import { ReactiveModel } from "@beyond-js/reactive/model";
import { Item } from "@beyond-js/reactive/entities";
// import { JSONSchemaType, JSONType } from "ajv";
import { UserProvider } from "@beyond-js/reactive/tests/backend/provider";
interface IUser {
	name?: string;
	password: string;
	lastnames: string;
}

export /*bundle */ class User extends Item<IUser> {
	protected properties = ["id", "name", "lastname"];

	protected storeName = "user";
	protected db = "test";

	constructor(id) {
		super(id);
		this.provider = new UserProvider();
		if (id) {
			console.log("init user", id);
			this.init(id);
		}
	}

	example() {
		//    this.name = "algo";
	}
}
