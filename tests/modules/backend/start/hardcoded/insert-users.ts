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
