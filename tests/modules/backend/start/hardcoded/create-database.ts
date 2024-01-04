import { v4 as uuidv4 } from 'uuid';
import * as sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { insertUsers } from './insert-users';

export const createDatabase = async () => {
	const db = await open({
		filename: 'reactive.db',
		driver: sqlite3.Database,
	});

	await db.exec(`
    DROP TABLE IF EXISTS users;
    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      deleted INTEGER,
      lastnames TEXT,
      instance_id INTEGER,
      time_updated INTEGER,
      UNIQUE(id)
    );
    
    DROP TABLE IF EXISTS books;
    CREATE TABLE books (
      id VARCHAR(50) PRIMARY KEY,
      title TEXT,
      year INTEGER,
      author TEXT,
      UNIQUE(id)
    );
  `);

	await db.close();

	await insertUsers();
};
