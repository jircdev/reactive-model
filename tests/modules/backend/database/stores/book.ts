import { DatabaseConnection } from '../connection';

interface Book {
	id: number;
	title: string;
	author: string;
	year: number;
}

interface LoadAllOptions {
	filter?: string;
	limit?: number;
}

export /*bundle*/ class BookStore {
	private conn: DatabaseConnection;

	constructor() {
		this.conn = new DatabaseConnection();
	}

	async loadBook(id: number): Promise<Book> {
		await this.conn.connect();
		const db = this.conn.connection;
		const book = await db.get('SELECT * FROM books WHERE id = ?', id);
		await this.conn.disconnect();
		return book as Book;
	}

	async storeBook(book: Book): Promise<any> {
		await this.conn.connect();
		const db = this.conn.connection;
		let recordId = book.id;
		const existingBook = await this.loadBook(recordId);
		let data;

		if (existingBook) {
			const { title, author, year } = book;
			data = await db.run(
				'UPDATE books SET title = ?, author = ?, year = ? WHERE id = ?',
				title,
				author,
				year,
				book.id
			);
		} else {
			const { id, title, author, year } = book;
			data = await db.run(
				'INSERT INTO books (id, title, author, year) VALUES (?, ?, ?, ?)',
				id,
				title,
				author,
				year
			);
			recordId = data.lastID;
		}
		const response = await this.loadBook(recordId);
		await this.conn.disconnect();
		return response;
	}

	async loadAll(options?: LoadAllOptions): Promise<Book[]> {
		const db = this.conn.connection;
		await this.conn.connect();
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

		const query = `SELECT * FROM books ${filter} LIMIT ${limit}`;
		const books = await db.all(query);
		await this.conn.disconnect();
		return books as Book[];
	}

	async bulkSave(books) {
		await this.conn.connect();
		const db = this.conn.connection;
		const insertedBooks = [];

		// Start a transaction
		await db.run('BEGIN TRANSACTION');

		try {
			for (const book of books) {
				const insertQuery = `INSERT INTO books (title, author, year) VALUES (?, ?, ?)`;
				await db.run(insertQuery, [book.title, book.author, book.year]);

				// Get the last inserted id
				const lastIdResult = await db.get('SELECT last_insert_rowid() as lastId');
				const lastId = lastIdResult.lastId;

				// Create a new book object with the inserted id
				const insertedBook = { ...book, id: lastId };
				insertedBooks.push(insertedBook);
			}

			// Commit the transaction
			await db.run('COMMIT');
		} catch (error) {
			console.error('Error inserting books:', error);

			// Rollback the transaction in case of an error
			await db.run('ROLLBACK');
			throw error;
		}

		await this.conn.disconnect();

		return insertedBooks;
	}
}
