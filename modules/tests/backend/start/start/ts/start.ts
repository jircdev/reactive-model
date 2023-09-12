import { v4 as uuidv4 } from 'uuid';
import * as sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { v4 as uuidv4 } from 'uuid';

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
    id VARCHAR(50) PRIMARY KEY,
    
    name TEXT,
    deleted INTEGER,
    lastnames TEXT,
    time_updated INTEGER,
    UNIQUE(id)
  )
  `);

	await insertUsers(); // Call insertUsers here
	await db.close();
};

const insertUsers = async () => {
	const db = await open({
		filename: 'reactive.db',
		driver: sqlite3.Database,
	});

	const insertQuery = `INSERT INTO users (id, name, deleted, lastnames, time_updated) VALUES (?, ?, ?, ?, ?)`;
	for (let i = 1; i <= 20; i++) {
		const id = `${uuidv4().toString()}`;
		const name = `User${i}`;
		const deleted = 0;
		const lastnames = `Lastname${i}`;
		const time_updated = Math.floor(Date.now() / 1000);
		await db.run(insertQuery, id, name, deleted, lastnames, time_updated);
	}
	await db.close();
};

createTable();
