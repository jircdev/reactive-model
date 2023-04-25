import * as sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

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
	private db: Database;

	constructor() {
		this.db = null;
	}

	async connect() {
		this.db = await open({
			filename: "reactive.db",
			driver: sqlite3.Database,
		});
	}

	async disconnect() {
		if (this.db) {
			await this.db.close();
			this.db = null;
		}
	}

	async loadUser(id: number): Promise<User> {
		if (!this.db) {
			await this.connect();
		}

		const user = await this.db.get("SELECT * FROM users WHERE id = ?", id);

		return user as User;
	}

	async storeUser(user: User): Promise<void> {
		if (!this.db) {
			await this.connect();
		}

		const existingUser = await this.loadUser(user.id);

		if (existingUser) {
			const { name, lastnames } = user;
			await this.db.run("UPDATE users SET name = ?, lastnames = ? WHERE id = ?", name, lastnames, user.id);
		} else {
			const { id, name, lastnames } = user;
			await this.db.run("INSERT INTO users (id, name, lastnames) VALUES (?, ?, ?)", id, name, lastnames);
		}
	}

	async loadAll(options?: LoadAllOptions): Promise<User[]> {
		if (!this.db) {
			await this.connect();
		}

		let filter = "";
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

		const users = await this.db.all(query);

		return users as User[];
	}

	async bulkSave(users) {
		if (!this.db) {
			await this.connect();
		}

		const insertedUsers = [];

		// Start a transaction
		await this.db.run("BEGIN TRANSACTION");

		try {
			for (const user of users) {
				const insertQuery = `INSERT INTO users (name, lastnames) VALUES (?, ?)`;
				await this.db.run(insertQuery, [user.name, user.lastnames]);

				// Get the last inserted id
				const lastIdResult = await this.db.get("SELECT last_insert_rowid() as lastId");
				const lastId = lastIdResult.lastId;

				// Create a new user object with the inserted id
				const insertedUser = { ...user, id: lastId };
				insertedUsers.push(insertedUser);
			}

			// Commit the transaction
			await this.db.run("COMMIT");
		} catch (error) {
			console.error("Error inserting users:", error);

			// Rollback the transaction in case of an error
			await this.db.run("ROLLBACK");
			throw error;
		}

		return insertedUsers;
	}
}
