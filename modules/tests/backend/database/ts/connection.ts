import * as sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

export /*bundle*/ class DatabaseConnection {
    private db: Database;

    constructor() {
        this.db = null;
    }

    async connect() {
        if (!this.db) {
            this.db = await open({
                filename: 'reactive.db',
                driver: sqlite3.Database,
            });
        }
    }

    async disconnect() {
        if (this.db) {
            await this.db.close();
            this.db = null;
        }
    }

    get connection() {
        return this.db;
    }
}
