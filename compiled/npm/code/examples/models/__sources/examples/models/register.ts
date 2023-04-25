import Dexie from "dexie";

const db = new Dexie("ReactiveDatabase");
db.version(1).stores({ schemas: "name, table, fields" });

const map = new Map();
export /* bundle */ function database(name) {
	if (map.has(name)) return map.get(name);

	const schema = new Dexie(name);
	map.set(name, { db: schema, version: 1 });

	return schema;
}
