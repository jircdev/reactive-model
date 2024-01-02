import { DBManager } from '@beyond-js/reactive/database';
async function create() {
	try {
		const db = await DBManager.config('test@3', {
			user: '&id, name, lastnames',
			books: '&id, title, author, year',
		});

		//db.user.bulkAdd(users);
	} catch (e) {
		console.trace('error', e);
	}
}

create();
