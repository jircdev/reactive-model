import * as sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

interface User {
	id: number;
	name: string;
	lastnames: string;
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

	async loadAll(): Promise<User[]> {
		if (!this.db) {
			await this.connect();
		}

		const users = await this.db.all("SELECT * FROM users");

		return users as User[];
	}


	
}
