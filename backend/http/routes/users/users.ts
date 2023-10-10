import express, { Application, Request, Response } from 'express';

type User = {
	id: number;
	name: string;
	email: string;
};

export class UsersRoutes {
	users: User[] = [];

	static setup(app) {
		app.get('/users', UsersRoutes.getAllUsers);
		app.get('/users/:id', UsersRoutes.getUserById);
		app.post('/users', UsersRoutes.createUser);
		app.put('/users/:id', UsersRoutes.updateUser);
		app.delete('/users/:id', UsersRoutes.deleteUser);
	}

	static getAllUsers = (_: Request, res: Response) => {
		res.json(this.users);
	};

	static getUserById = (req: Request, res: Response) => {
		const user = this.users.find(u => u.id === parseInt(req.params.id));
		if (user) {
			res.json(user);
		} else {
			res.status(404).json({ message: 'User not found' });
		}
	};

	static createUser = (req: Request, res: Response) => {
		const newUser: User = {
			id: users.length + 1,
			name: req.body.name,
			email: req.body.email,
		};
		users.push(newUser);
		res.status(201).json(newUser);
	};

	static updateUser = (req: Request, res: Response) => {
		const id = parseInt(req.params.id);
		const user = users.find(u => u.id === id);

		if (user) {
			user.name = req.body.name || user.name;
			user.email = req.body.email || user.email;
			res.json(user);
		} else {
			res.status(404).json({ message: 'User not found' });
		}
	};

	static deleteUser = (req: Request, res: Response) => {
		const id = parseInt(req.params.id);
		const index = users.findIndex(u => u.id === id);

		if (index !== -1) {
			users.splice(index, 1);
			res.status(204).send();
		} else {
			res.status(404).json({ message: 'User not found' });
		}
	};
}
