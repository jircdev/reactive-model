const BEE = require('@beyond-js/bee');

const port = '2490';

global.self = global;
require('@beyond-js/kernel/vendor/s.js');

let Item;
let Collection;
let Profile;
let ProfilesCollection;
let User;

beforeAll(async () => {
	BEE(`http://localhost:${port}`, {});

	const itemModule = await bimport('@beyond-js/reactive/entities/item');
	Item = itemModule.Item;

	const collectionModule = await bimport('@beyond-js/reactive/entities/collection');
	Collection = collectionModule.Collection;

	Profile = class extends Item {
		constructor(specs = {}) {
			super({
				entity: 'profiles',
				properties: ['id', 'name'],
				...specs,
			});
		}
	};

	ProfilesCollection = class extends Collection {
		constructor(specs = {}) {
			super({
				entity: 'profiles',
				item: Profile,
				...specs,
			});
		}
	};

	User = class extends Item {
		constructor(specs = {}) {
			super({
				entity: 'users',
				properties: ['id', { name: 'profiles', value: ProfilesCollection }],
				...specs,
			});
		}
	};
});

describe('Item collection property set behaviour', () => {
	test('removes collection entries absent on subsequent set calls', () => {
		const user = new User();

		user.set({
			id: 'user-1',
			profiles: [
				{ id: 'profile-1', name: 'First profile' },
				{ id: 'profile-2', name: 'Second profile' },
			],
		});

		expect(user.profiles.items).toHaveLength(2);
		expect(user.profiles.items.map(profile => profile.getProperty('id'))).toEqual(['profile-1', 'profile-2']);

		user.set({
			id: 'user-1',
			profiles: [],
		});

		expect(user.profiles.items).toHaveLength(0);
	});

	test('keeps existing entries that remain while removing missing ones', () => {
		const user = new User();

		user.set({
			id: 'user-2',
			profiles: [
				{ id: 'profile-1', name: 'First profile' },
				{ id: 'profile-2', name: 'Second profile' },
			],
		});

		user.set({
			id: 'user-2',
			profiles: [{ id: 'profile-2', name: 'Second profile updated' }],
		});

		expect(user.profiles.items).toHaveLength(1);
		expect(user.profiles.items[0].getProperty('id')).toBe('profile-2');
		expect(user.profiles.items[0].getProperty('name')).toBe('Second profile updated');
	});
});
