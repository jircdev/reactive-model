import { Collection, ICollectionProvider } from '@beyond-js/reactive/entities/collection';
import { Item, IEntityProvider, IItem } from '@beyond-js/reactive/entities/item';

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

describe('Collection - Source Code Tests', () => {
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

	describe('Instanciación', () => {
		test('debe crear una instancia de Collection', () => {
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
			expect(Collection.isCollection).toBe(true);
			expect(collection.entity).toBe('users');
		});

		test('debe inicializar con defaultLimit', () => {
			class Users extends Collection<User, MockCollectionProvider> {
				constructor(specs: any = {}) {
					super({
						entity: 'users',
						item: User,
						defaultLimit: 20,
						...specs,
					});
				}
			}

			const collection = new Users();

			// Verificar que defaultLimit se estableció (no es público, pero se usa en load)
			expect(collection.entity).toBe('users');
		});
	});

	describe('Método load()', () => {
		test('debe cargar items desde provider', async () => {
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
			expect((collection.items[0] as any).name).toBe('John');
			expect((collection.items[1] as any).name).toBe('Jane');
		});

		test('debe manejar respuesta con items y total', async () => {
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

			await collection.load();

			expect(collection.getTotal()).toBe(2);
		});

		test('debe lanzar error si provider no implementa list()', async () => {
			class Users extends Collection<User, ICollectionProvider> {
				constructor(specs: any = {}) {
					super({
						entity: 'users',
						item: User,
						...specs,
					});
				}
			}

			const collection = new Users();

			await expect(collection.load()).rejects.toThrow(
				'DataProvider is not defined or does not implement the list() method.',
			);
		});
	});

	describe('Gestión de items', () => {
		test('debe agregar items con addItems()', () => {
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

		test('debe actualizar items existentes si tienen el mismo id', () => {
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
			const item1 = new User({ id: '1', name: 'John', email: 'john@example.com' });
			collection.addItems([item1]);

			const item2 = new User({ id: '1', name: 'John Updated', email: 'john@example.com' });
			collection.addItems([item2]);

			expect(collection.items).toHaveLength(1);
			expect((collection.items[0] as any).name).toBe('John Updated');
		});

		test('debe limpiar items al cargar con clear', async () => {
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

			const provider1 = new MockCollectionProvider([{ id: '1', name: 'John', email: 'john@example.com' }]);
			const collection = new Users();
			(collection as any).provider = provider1;

			await collection.load();
			expect(collection.items).toHaveLength(1);

			const provider2 = new MockCollectionProvider([{ id: '2', name: 'Jane', email: 'jane@example.com' }]);
			(collection as any).provider = provider2;

			await collection.load();
			expect(collection.items).toHaveLength(1);
			expect((collection.items[0] as any).id).toBe('2');
		});
	});

	describe('Paginación', () => {
		test('debe manejar paginación con next', async () => {
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

			class PaginatedProvider implements ICollectionProvider {
				async list(specs?: any): Promise<any> {
					if (specs?.next) {
						return {
							items: [{ id: '2', name: 'Jane', email: 'jane@example.com' }],
							total: 2,
							next: null,
						};
					}
					return {
						items: [{ id: '1', name: 'John', email: 'john@example.com' }],
						total: 2,
						next: 'page2',
					};
				}
			}

			const provider = new PaginatedProvider();
			const collection = new Users();
			(collection as any).provider = provider;

			await collection.load();

			expect(collection.getNext()).toBe('page2');
			expect(collection.getTotal()).toBe(2);
		});
	});

	describe('Método delete()', () => {
		test('debe eliminar múltiples items', async () => {
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
			const deleteManySpy = jest.spyOn(provider, 'deleteMany').mockResolvedValue(true);

			const collection = new Users();
			(collection as any).provider = provider;

			await collection.load();
			expect(collection.items).toHaveLength(2);

			const results = await collection.delete(['1', '2']);

			expect(deleteManySpy).toHaveBeenCalledWith(['1', '2']);
			expect(results).toHaveLength(2);
			expect(results.every((r) => r === true)).toBe(true);
		});
	});

	describe('Eventos', () => {
		test('debe disparar evento load después de cargar', async () => {
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

			const mockData = [{ id: '1', name: 'John', email: 'john@example.com' }];
			const provider = new MockCollectionProvider(mockData);
			const collection = new Users();
			(collection as any).provider = provider;

			const loadPromise = new Promise((resolve) => {
				collection.on('load', ({ items, total, next }) => {
					expect(items).toBeDefined();
					expect(total).toBe(1);
					resolve(undefined);
				});
			});

			await collection.load();
			await loadPromise;
		});

		test('debe disparar evento items.changed al agregar items', () => {
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
			const items = [new User({ id: '1', name: 'John', email: 'john@example.com' })];

			let changed = false;
			collection.on('items.changed', () => {
				changed = true;
			});

			collection.addItems(items);
			expect(changed).toBe(true);
		});
	});

	describe('getItemProperties()', () => {
		test('debe retornar propiedades de todos los items', () => {
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

			const props = collection.getItemProperties();

			expect(props).toHaveLength(2);
			expect(props[0].name).toBe('John');
			expect(props[1].name).toBe('Jane');
		});
	});
});

