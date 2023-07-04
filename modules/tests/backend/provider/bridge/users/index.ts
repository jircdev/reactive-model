import { UserStore } from '@beyond-js/reactive/tests/backend/database';
import type { Server, Socket } from 'socket.io';

export /*actions*/ /*bundle*/ class UserProvider {
	socket: Server;
	constructor(socket: Server) {
		this.socket = socket;
	}
	async publish(data) {
		try {
			const user = new UserStore();
			let response = await user.storeUser(data);

			return { status: true, data: response };
		} catch (e) {
			console.error(e);
			return { error: true, message: e.message };
		}
	}

	async load({ id }) {
		try {
			if (!id) {
				return { status: false, error: true, message: 'id is required' };
			}

			const user = new UserStore();
			const data = await user.loadUser(id);
			if (!data) {
				return { status: true, data: false };
			}
			//@ts-ignore
			data.isDeleted = data.deleted;
			//@ts-ignore
			delete data.deleted;
			return { status: true, data };
		} catch (e) {
			return { error: true, message: e.message };
		}
	}

	async list() {
		try {
			const user = new UserStore();
			const { entries, deletedIds } = await user.loadAll();
			console.log(0.1, entries);
			return { status: true, data: { entries, deletedEntries: deletedIds } };
		} catch (e) {
			return { error: true, message: e.message };
		}
	}

	async bulkSave(data) {
		try {
			const user = new UserStore();

			const entries = await user.bulkSave(data);

			return { status: true, data: { entries } };
		} catch (e) {
			return { error: true, message: e.message };
		}
	}

	async delete(id) {
		try {
			const user = new UserStore();
			const response = await user.delete(id);

			return { status: true, data: response };
		} catch (e) {
			return { error: true, message: e.message };
		}
	}

	async deleteItems(ids) {
		try {
			if (!Array.isArray(ids)) {
				return { error: true, message: 'ids must be an array' };
			}
			const users = new UserStore();

			//@ts-ignore
			const response = await users.deleteItems(ids);
			return { status: true, data: response };
		} catch (e) {
			return { error: true, message: e.message };
		}
	}
}
