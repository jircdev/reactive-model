import { UsersRoutes } from './users/users';

export /*bundle*/ class Routes {
	static setup(app) {
		app.get('/', (req, res) => res.send('Reactive  API http server'));
		UsersRoutes.setup(app);
	}
}
