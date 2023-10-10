import { v4 as uuidv4 } from 'uuid';
import * as sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export const createDatabase = async () => {
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
