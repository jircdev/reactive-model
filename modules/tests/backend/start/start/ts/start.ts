import * as sqlite3 from 'sqlite3';
import { open } from 'sqlite';

/*
 * Initialize library beyondJS backend server
 */
import { listen } from '@beyond-js/backend/listen';

listen(6580);

const createTable = async () => {
	const db = await open({
		filename: 'reactive.db',
		driver: sqlite3.Database,
	});

	await db.exec(`
  DROP TABLE IF EXISTS users;
  CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    uuid TEXT NOT NULL,
    name TEXT,
    lastnames TEXT,
    time_updated INTEGER,
    UNIQUE(uuid)
  )
  `);

	await db.close();
};

createTable();
