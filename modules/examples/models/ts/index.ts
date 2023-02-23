import { ReactiveModel } from "reactive-model/model";
import { JSONSchemaType, JSONType } from "ajv";

interface IUser {
    name?: string;
    password: string;
    lastname: string;
}

export /*bundle */ class User extends ReactiveModel<IUser> {
    protected schema: JSONSchemaType<IUser> = {
        type: "object",
        properties: {
            name: { type: "string", nullable: true },
            lastname: { type: "string" },
            password: { type: "string" },
        },
        required: ["password"],
    };

    example() {
        //    this.name = "algo";
    }
}
