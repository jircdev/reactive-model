import { DatabaseConnection } from '../connection';

export /*bundle*/ interface IUser {
	id: number;
	name: string;
	lastnames: string;
}

interface LoadAllOptions {
	name?: string;
	lastnames?: string;
	limit?: number;
}

export /*bundle*/ class UserStore {
	private conn: DatabaseConnection;
	esx;
	constructor() {
		this.conn = new DatabaseConnection();
	}

	async loadUser(id: number): Promise<IUser> {
		await this.conn.connect();
		const db = this.conn.connection;
		const user = await db.get('SELECT * FROM users WHERE id = ?', id);
		return user as IUser;
	}

	async storeUser(user: IUser): Promise<any> {
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

		return response;
	}

	async loadAll(options?: LoadAllOptions): Promise<{ entries: IUser[]; deletedIds: number[] }> {
		await this.conn.connect();
		const db = this.conn.connection;
		let filter = 'WHERE deleted = 0';

		let limitToApply = options?.limit || 30;
		if (options && options.hasOwnProperty('limit')) delete options.limit;

		if (options && Object.keys(options).length) {
			Object.entries(options).forEach(([key, value]) => {
				filter += ` AND ${key} = ${value}`;
			});
		}

		const query = `SELECT * FROM users ${filter} LIMIT ${limitToApply}`;
		const users = await db.all(query);

		const deletedUsersQuery = `SELECT id FROM users WHERE deleted = 1`;
		const deletedUsers = await db.all(deletedUsersQuery);

		await this.conn.disconnect();

		return {
			entries: users as IUser[],
			deletedIds: deletedUsers.map(user => user.id),
		};
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
		const query = `UPDATE users SET deleted = 1 WHERE id IN (${placeholders})`;

		await db.run(query, ids);
		await this.conn.disconnect();
	}

	async delete(id) {
		return this.deleteItems([id]);
	}
}
