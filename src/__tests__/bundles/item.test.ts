import { Item, IEntityProvider, IItem } from 'reactive/entities/item';

// Test interface
interface IUser extends IItem {
	name: string;
	email: string;
}

// Mock provider
class MockProvider implements IEntityProvider {
	private data: any;

	constructor(data: any) {
		this.data = data;
	}

	async load(specs?: any): Promise<any> {
		return this.data;
	}

	async publish(data: any): Promise<{ status: number; data: any }> {
		return { status: 200, data };
	}

	async delete(specs?: any): Promise<boolean> {
		return true;
	}
}

describe('Item - Bundle Tests', () => {
	describe('Instanciación desde bundle', () => {
		test('debe crear una instancia de Item desde bundle', () => {
			class User extends Item<IUser, MockProvider> {
				constructor(specs: any = {}) {
					super({
						entity: 'users',
						properties: ['id', 'name', 'email'],
						...specs,
					});
				}
			}

			const user = new User({ id: '1' });

			expect(user).toBeInstanceOf(Item);
			expect(user.entity).toBe('users');
		});

		test('debe inicializar con datos desde bundle', () => {
			class User extends Item<IUser, MockProvider> {
				constructor(specs: any = {}) {
					super({
						entity: 'users',
						properties: ['id', 'name', 'email'],
						...specs,
					});
				}
			}

			const user = new User({ id: '1', name: 'John', email: 'john@example.com' });

			expect(user.id).toBe('1');
			expect(user.name).toBe('John');
		});
	});

	describe('Registry desde bundle', () => {
		test('debe tener un registry asociado desde bundle', () => {
			class User extends Item<IUser, MockProvider> {
				constructor(specs: any = {}) {
					super({
						entity: 'users',
						properties: ['id', 'name'],
						...specs,
					});
				}
			}

			const user = new User({ id: '1' });

			expect(user.registry).toBeDefined();
			expect(user.__instanceId).toBeDefined();
		});
	});

	describe('Método load() desde bundle', () => {
		test('debe cargar datos desde provider usando bundle', async () => {
			class User extends Item<IUser, MockProvider> {
				constructor(specs: any = {}) {
					super({
						entity: 'users',
						provider: MockProvider,
						properties: ['id', 'name', 'email'],
						...specs,
					});
				}
			}

			const mockData = { id: '1', name: 'John', email: 'john@example.com' };
			const provider = new MockProvider(mockData);

			const user = new User({ id: '1' });
			(user as any)._provider = provider;

			await user.load();

			expect(user.fetched).toBe(true);
			expect(user.found).toBe(true);
			expect(user.name).toBe('John');
		});
	});
});

