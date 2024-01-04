import { v4 as uuidv4 } from 'uuid';
import * as sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export const insertUsers = async () => {
	const db = await open({
		filename: 'reactive.db',
		driver: sqlite3.Database,
	});

	const insertQuery = `INSERT INTO users (id, name, deleted, lastnames, instance_id,  time_updated) VALUES (?, ?, ?, ?, ?, ?)`;
	for (let i = 1; i <= 20; i++) {
		const id = i;
		const name = `User${i}`;
		const deleted = 0;
		const lastnames = `Lastname${i}`;
		const time_updated = Math.floor(Date.now() / 1000);
		const instance_id = 4;
		await db.run(insertQuery, id, name, deleted, lastnames, instance_id, time_updated);
	}
	await db.close();
};
