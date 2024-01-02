import { UsersRoutes } from './users';

export /*bundle*/ class Routes {
	static setup(app) {
		app.get('/', (req, res) => res.send('Reactive API http server examples 2'));
		UsersRoutes.setup(app);
	}
}
