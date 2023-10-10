import { Application, Request, Response } from 'express';
import { UserStore, IUser } from '@beyond-js/reactive-tests/backend/database';

export class UsersRoutes {
	users: IUser[] = [];

	static setup(app) {
		app.get('/users', UsersRoutes.getAllUsers);
		app.get('/users/:id', UsersRoutes.getUserById);
		app.post('/users', UsersRoutes.createUser);
		app.put('/users/:id', UsersRoutes.updateUser);
		app.delete('/users/:id', UsersRoutes.deleteUser);
	}

	static async getAllUsers(_: Request, res: Response) {
		try {
			const user = new UserStore();
			const { entries, deletedIds } = await user.loadAll();

			res.json({ status: true, data: { entries, deletedEntries: deletedIds } });
		} catch (e) {
			return res.json({ error: true, message: e.message });
		}
	}

	static async getUserById(req: Request, res: Response) {
		try {
			const id = parseInt(req.params.id);
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

	static async createUser(req: Request, res: Response) {
		try {
			const user = new UserStore();
			let response = await user.storeUser(req.body);

			return { status: true, data: response };
		} catch (e) {
			console.error(e);
			return { error: true, message: e.message };
		}
	}

	static async updateUser(req: Request, res: Response) {
		const id = parseInt(req.params.id);

		try {
			const user = new UserStore();
			let response = await user.storeUser(req.body);

			return { status: true, data: response };
		} catch (e) {
			console.error(e);
			return { error: true, message: e.message };
		}
	}

	static async deleteUser(req: Request, res: Response) {
		const id = parseInt(req.params.id);
		try {
			const user = new UserStore();
			const response = await user.delete(id);

			return { status: true, data: response };
		} catch (e) {
			return { error: true, message: e.message };
		}
	}
}
