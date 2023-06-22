import { DatabaseConnection } from '../connection';

interface User {
	id: number;
	name: string;
	lastnames: string;
}

interface LoadAllOptions {
	filter?: string;
	limit?: number;
}

export /*bundle*/ class UserStore {
	private conn: DatabaseConnection;

	constructor() {
		this.conn = new DatabaseConnection();
	}

	async loadUser(id: number): Promise<User> {
		const db = this.conn.connection;
		const user = await db.get('SELECT * FROM users WHERE id = ?', id);

		return user as User;
	}

	async storeUser(user: User): Promise<any> {
		await this.conn.connect();
		const db = this.conn.connection;
		let recordId = user.id;
		const existingUser = await this.loadUser(recordId);
		let data;

		if (existingUser) {
			const { name, lastnames } = user;
			data = await db.run('UPDATE users SET name = ?, lastnames = ? WHERE id = ?', name, lastnames, user.id);
		} else {
			const { id, name, lastnames } = user;

			data = await db.run('INSERT INTO users (id, name, lastnames) VALUES (?, ?, ?)', id, name, lastnames);
			recordId = data.lastID;
		}
		const response = await this.loadUser(recordId);
		await this.conn.disconnect();
		console.log(1, response);
		return response;
	}

	async loadAll(options?: LoadAllOptions): Promise<User[]> {
		await this.conn.connect();
		const db = this.conn.connection;
		let filter = '';
		let limit = 30;

		if (options) {
			if (options.filter) {
				filter = `WHERE ${options.filter}`;
			}
			if (options.limit) {
				limit = options.limit;
			}
		}

		const query = `SELECT * FROM users ${filter} LIMIT ${limit}`;
		const users = await db.all(query);
		await this.conn.disconnect();
		return users as User[];
	}

	async bulkSave(users) {
		await this.conn.connect();
		const db = this.conn.connection;
		const insertedUsers = [];
		// Start a transaction
		await db.run('BEGIN TRANSACTION');

		try {
			for (const user of users) {
				const insertQuery = `INSERT INTO users (name, lastnames) VALUES (?, ?)`;
				await db.run(insertQuery, [user.name, user.lastnames]);

				// Get the last inserted id
				const lastIdResult = await db.get('SELECT last_insert_rowid() as lastId');
				const lastId = lastIdResult.lastId;

				// Create a new user object with the inserted id
				const insertedUser = { ...user, id: lastId };
				insertedUsers.push(insertedUser);
			}

			// Commit the transaction
			await db.run('COMMIT');
		} catch (error) {
			console.error('Error inserting users:', error);

			// Rollback the transaction in case of an error
			await db.run('ROLLBACK');
			this.conn.disconnect();
			throw error;
		}

		return insertedUsers;
	}

	async clear(): Promise<void> {
		await this.conn.connect();
		const db = this.conn.connection;

		const query = `DELETE FROM users`;
		await db.run(query);

		await this.conn.disconnect();
	}

	async deleteItems(ids: number[]): Promise<void> {
		await this.conn.connect();
		const db = this.conn.connection;
		const placeholders = ids.map(id => '?').join(', ');
		const query = `DELETE FROM users WHERE id IN (${placeholders})`;
		await db.run(query, ids);
		await this.conn.disconnect();
	}
}
