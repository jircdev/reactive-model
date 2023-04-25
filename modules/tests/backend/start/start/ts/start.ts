import * as sqlite3 from "sqlite3";
import { open } from "sqlite";

/*
 * Initialize library beyondJS backend server
 */
import { listen } from "@beyond-js/backend/listen";

listen(6580);

const createTable = async () => {
	const db = await open({
		filename: "reactive.db",
		driver: sqlite3.Database,
	});

	await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      name TEXT,
      lastnames TEXT
    )
  `);

	await db.close();
};

createTable();
