import { BookStore } from '@beyond-js/reactive-tests/backend/database';
import { Server, Socket } from 'socket.io';

export /*actions*/ /*bundle*/ class BooksProvider {
	socket: Server;
	constructor(socket: Server) {
		this.socket = socket;
	}
	async save(data) {
		try {
			const books = new BookStore();
			await books.storebooks(data);
			return { status: true };
		} catch (e) {
			return { error: true, message: e.message };
		}
	}

	async load({ id }) {
		try {
			const books = new BookStore();
			const data = await books.loadbooks(id);

			return { status: true, data };
		} catch (e) {
			return { error: true, message: e.message };
		}
	}

	async list() {
		try {
			const books = new BookStore();
			const entries = await books.loadAll();
			return { status: true, data: { entries } };
		} catch (e) {
			return { error: true, message: e.message };
		}
	}

	send() {
		this.socket.emit('books', { name: 'algo' });
	}
}
