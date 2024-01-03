import { UserStore } from '@beyond-js/reactive-tests/backend/database';

export /*actions*/ /*bundle*/ class Users {
	async publish(data) {
		try {
			const user = new UserStore();
			let response = await user.storeUser(data);

			return response;
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
				return;
			}
			//@ts-ignore
			data.isDeleted = data.deleted;
			//@ts-ignore
			delete data.deleted;
			return data;
		} catch (e) {
			return { error: true, message: e.message };
		}
	}

	async list() {
		try {
			const user = new UserStore();
			const { entries, deletedIds } = await user.loadAll();

			return { entries, deletedEntries: deletedIds };
		} catch (e) {
			return { error: true, message: e.message };
		}
	}

	async bulkSave(data) {
		try {
			const user = new UserStore();

			const entries = await user.bulkSave(data);

			return { entries };
		} catch (e) {
			return { error: true, message: e.message };
		}
	}

	async delete(id) {
		try {
			const user = new UserStore();
			const response = await user.delete(id);

			return { data: response };
		} catch (e) {
			return { message: e.message };
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
			return response;
		} catch (e) {
			return { error: true, message: e.message };
		}
	}

	prueba() {
		return { data: 'prueba' };
	}
}
