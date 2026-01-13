import { Collection, ICollectionProvider } from 'reactive/entities/collection';
import { Item, IEntityProvider, IItem } from 'reactive/entities/item';

// Test interfaces
interface IUser extends IItem {
	name: string;
	email: string;
}

// Mock providers
class MockItemProvider implements IEntityProvider {
	async load(specs?: any): Promise<any> {
		return { id: specs?.id || '1', name: 'Test', email: 'test@example.com' };
	}

	async publish(data: any): Promise<{ status: number; data: any }> {
		return { status: 200, data };
	}

	async delete(specs?: any): Promise<boolean> {
		return true;
	}
}

class MockCollectionProvider implements ICollectionProvider {
	private data: any[];

	constructor(data: any[] = []) {
		this.data = data;
	}

	async list(specs?: any): Promise<any> {
		return {
			items: this.data,
			total: this.data.length,
			next: null,
		};
	}

	async deleteMany(ids: any[]): Promise<boolean> {
		return true;
	}
}

describe('Collection - Bundle Tests', () => {
	// Test Item class
	class User extends Item<IUser, MockItemProvider> {
		constructor(specs: any = {}) {
			super({
				entity: 'users',
				properties: ['id', 'name', 'email'],
				...specs,
			});
		}
	}

	describe('Instanciación desde bundle', () => {
		test('debe crear una instancia de Collection desde bundle', () => {
			class Users extends Collection<User, MockCollectionProvider> {
				constructor(specs: any = {}) {
					super({
						entity: 'users',
						item: User,
						...specs,
					});
				}
			}

			const collection = new Users();

			expect(collection).toBeInstanceOf(Collection);
			expect(collection.isCollection).toBe(true);
			expect(collection.entity).toBe('users');
		});
	});

	describe('Método load() desde bundle', () => {
		test('debe cargar items desde provider usando bundle', async () => {
			class Users extends Collection<User, MockCollectionProvider> {
				constructor(specs: any = {}) {
					super({
						entity: 'users',
						provider: MockCollectionProvider,
						item: User,
						...specs,
					});
				}
			}

			const mockData = [
				{ id: '1', name: 'John', email: 'john@example.com' },
				{ id: '2', name: 'Jane', email: 'jane@example.com' },
			];

			const provider = new MockCollectionProvider(mockData);
			const collection = new Users();
			(collection as any).provider = provider;

			const items = await collection.load();

			expect(items).toHaveLength(2);
			expect(collection.items).toHaveLength(2);
			expect(collection.items[0].name).toBe('John');
		});
	});

	describe('Gestión de items desde bundle', () => {
		test('debe agregar items con addItems() usando bundle', () => {
			class Users extends Collection<User, MockCollectionProvider> {
				constructor(specs: any = {}) {
					super({
						entity: 'users',
						item: User,
						...specs,
					});
				}
			}

			const collection = new Users();
			const items = [
				new User({ id: '1', name: 'John', email: 'john@example.com' }),
				new User({ id: '2', name: 'Jane', email: 'jane@example.com' }),
			];

			collection.addItems(items);

			expect(collection.items).toHaveLength(2);
		});
	});
});

