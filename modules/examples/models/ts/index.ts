import { ReactiveModel } from "reactive-model/main";
// import { JSONSchemaType, JSONType } from "ajv";

interface IUser {
	name?: string;
	password: string;
	lastname: string;
}

export /*bundle */ class User extends ReactiveModel<IUser> {
	example() {
		//    this.name = "algo";
	}
}
