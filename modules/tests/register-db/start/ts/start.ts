import { DBManager } from '@beyond-js/reactive-2/database';
async function create() {
	try {
		const db = await DBManager.config('test@2', {
			user: '++id, name, lastnames',
		});

		const users = [];
		for (let i = 1; i <= 20; i++) {
			users.push({
				id: i,
				name: `User ${i}`,
				lastname: `Lastname ${i}`,
			});

			//db.user.add(newUser);
		}

		//db.user.bulkAdd(users);
	} catch (e) {
		console.trace('error', e);
	}
}

create();
