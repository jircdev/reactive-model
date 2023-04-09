import { ReactiveModel } from "@beyond-js/reactive/model";
// import { JSONSchemaType, JSONType } from "ajv";

interface IUser {
	name?: string;
	password: string;
	lastname: string;
}

export /*bundle */ class User extends ReactiveModel<IUser> {
	protected properties = ["name", "lastname"];
	example() {
		//    this.name = "algo";
	}
}
