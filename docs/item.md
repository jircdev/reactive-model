## Item

La clase Item es una clase abstracta que extiende de ReactiveModel. Esta clase representa un objeto "reactivo" en el sentido de que puede manejar cambios en sus propiedades y actualizar automáticamente otras partes del código, gracias a la herencia de ReactiveModel.

Item tiene un proveedor local (LocalProvider) y un proveedor remoto (provider). El proveedor local maneja las operaciones de carga y almacenamiento en la base de datos local (como IndexedDB) mientras que el proveedor remoto interactúa con un servidor externo.

La clase Item también incluye instancias de ItemSaveManager y ItemLoadManager para manejar las operaciones de guardado y carga, respectivamente. Estos administradores trabajan en conjunto con los proveedores locales y remotos para sincronizar los datos.

El siguiente ejemplo de uso crea una clase User que extiende de Item:

```
import { ReactiveModel } from "@beyond-js/reactive-2/model";
import { Item } from "@beyond-js/reactive-2/entities";
import { UserProvider } from "@beyond-js/reactive-2/tests/backend/provider";

interface IUser {
	name?: string;
	password: string;
	lastnames: string;
}

export /*bundle */ class User extends Item<IUser> {
	protected properties = ["id", "name", "lastnames"];

	protected storeName = "user";
	protected db = "test";

	constructor({ id = undefined } = {}) {
		super(id);
		this.provider = new UserProvider();
		this.init({ id });
	}

	example() {
		//    this.name = "algo";
	}
}

```

En este ejemplo, se define la clase User que hereda de Item. La clase User tiene propiedades como id, name y lastname, y utiliza un proveedor de usuario UserProvider para interactuar con un servidor externo. También define el nombre de la tienda local (storeName) y el nombre de la base de datos local (db).

Para usar esta clase, simplemente instancie un objeto User y utilice sus métodos heredados como save, load, sync, etc., para interactuar con la base de datos local y remota.
