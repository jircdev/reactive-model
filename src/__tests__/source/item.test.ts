import { Item, IEntityProvider, IItem } from '@beyond-js/reactive/entities/item';

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

describe('Item - Source Code Tests', () => {
	describe('Instanciación', () => {
		test('debe crear una instancia de Item con entity', () => {
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

		test('debe lanzar error si entity no se proporciona', () => {
			class User extends Item<IUser, MockProvider> {
				constructor(specs: any = {}) {
					super({
						properties: ['id', 'name'],
						...specs,
					});
				}
			}

			expect(() => new User()).toThrow('Entity is required');
		});

		test('debe inicializar con datos', () => {
			class User extends Item<IUser, MockProvider> {
				constructor(specs: any = {}) {
					super({
						entity: 'users',
						properties: ['id', 'name', 'email'],
						...specs,
					});
				}
			}

			const user = new User({ id: '1', name: 'John', email: 'john@example.com' }) as any;

			expect(user.id).toBe('1');
			expect(user.name).toBe('John');
			expect(user.email).toBe('john@example.com');
		});
	});

	describe('Registry', () => {
		test('debe tener un registry asociado', () => {
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

		test('debe sincronizar cambios con registry', () => {
			class User extends Item<IUser, MockProvider> {
				constructor(specs: any = {}) {
					super({
						entity: 'users',
						properties: ['id', 'name'],
						...specs,
					});
				}
			}

			const user = new User({ id: '1', name: 'John' });

			user.set({ name: 'Updated' });

			// El registry debería tener los valores actualizados
			expect(user.registry.getValues().name).toBe('Updated');
		});
	});

	describe('Método load()', () => {
		test('debe cargar datos desde provider', async () => {
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
			(MockProvider as any).mockData = mockData;

			const user = new User({ id: '1' });
			const provider = new MockProvider(mockData);
			(user as any)._provider = provider;

			await user.load();

			expect(user.fetched).toBe(true);
			expect(user.found).toBe(true);
			expect((user as any).name).toBe('John');
		});

		test('debe lanzar error si provider no implementa load()', async () => {
			class User extends Item<IUser, IEntityProvider> {
				constructor(specs: any = {}) {
					super({
						entity: 'users',
						properties: ['id', 'name'],
						...specs,
					});
				}
			}

			const user = new User({ id: '1' });

			await expect(user.load()).rejects.toThrow();
		});

		test('debe manejar errores de carga', async () => {
			class FailingProvider implements IEntityProvider {
				async load(): Promise<any> {
					throw new Error('Load failed');
				}
			}

			class User extends Item<IUser, FailingProvider> {
				constructor(specs: any = {}) {
					super({
						entity: 'users',
						provider: FailingProvider,
						properties: ['id', 'name'],
						...specs,
					});
				}
			}

			const user = new User({ id: '1' });

			await expect(user.load()).rejects.toThrow('Load failed');
			expect(user.found).toBe(false);
			expect(user.fetched).toBe(false);
		});
	});

	describe('Método publish()', () => {
		test('debe publicar datos a través del provider', async () => {
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
			const publishSpy = jest.spyOn(provider, 'publish').mockResolvedValue({
				status: 200,
				data: { ...mockData, name: 'Updated' },
			});

			const user = new User(mockData);
			(user as any)._provider = provider;

			const result = await user.publish({ name: 'Updated' });

			expect(publishSpy).toHaveBeenCalled();
			expect(result.name).toBe('Updated');
			expect(user.unpublished).toBe(false);
		});

		test('debe publicar sin provider si no está disponible', async () => {
			class User extends Item<IUser, IEntityProvider> {
				constructor(specs: any = {}) {
					super({
						entity: 'users',
						properties: ['id', 'name'],
						...specs,
					});
				}
			}

			const user = new User({ id: '1', name: 'John' });
			const result = await user.publish();

			expect(result).toBeDefined();
			expect(result.name).toBe('John');
		});
	});

	describe('Método delete()', () => {
		test('debe eliminar item a través del provider', async () => {
			class User extends Item<IUser, MockProvider> {
				constructor(specs: any = {}) {
					super({
						entity: 'users',
						provider: MockProvider,
						properties: ['id', 'name'],
						...specs,
					});
				}
			}

			const provider = new MockProvider({});
			const deleteSpy = jest.spyOn(provider, 'delete').mockResolvedValue(true);

			const user = new User({ id: '1', name: 'John' });
			(user as any)._provider = provider;

			const result = await user.delete();

			expect(deleteSpy).toHaveBeenCalledWith('1');
			expect(result).toBe(true);
			expect(user.deleted).toBe(true);
		});

		test('debe eliminar sin provider si skipProvider es true', async () => {
			class User extends Item<IUser, MockProvider> {
				constructor(specs: any = {}) {
					super({
						entity: 'users',
						provider: MockProvider,
						properties: ['id', 'name'],
						...specs,
					});
				}
			}

			const provider = new MockProvider({});
			const deleteSpy = jest.spyOn(provider, 'delete');

			const user = new User({ id: '1', name: 'John' });
			(user as any)._provider = provider;

			const result = await user.delete({ skipProvider: true });

			expect(deleteSpy).not.toHaveBeenCalled();
			expect(result).toBe(true);
			expect(user.deleted).toBe(true);
		});
	});

	describe('Estados', () => {
		test('debe manejar estado fetched', async () => {
			class User extends Item<IUser, MockProvider> {
				constructor(specs: any = {}) {
					super({
						entity: 'users',
						provider: MockProvider,
						properties: ['id', 'name'],
						...specs,
					});
				}
			}

			const mockData = { id: '1', name: 'John' };
			const provider = new MockProvider(mockData);

			const user = new User({ id: '1' });
			(user as any)._provider = provider;

			expect(user.fetched).toBeUndefined();

			await user.load();

			expect(user.fetched).toBe(true);
		});

		test('debe manejar estado found', async () => {
			class User extends Item<IUser, MockProvider> {
				constructor(specs: any = {}) {
					super({
						entity: 'users',
						provider: MockProvider,
						properties: ['id', 'name'],
						...specs,
					});
				}
			}

			const mockData = { id: '1', name: 'John' };
			const provider = new MockProvider(mockData);

			const user = new User({ id: '1' });
			(user as any)._provider = provider;

			await user.load();

			expect(user.found).toBe(true);
		});
	});

	describe('Eventos', () => {
		test('debe disparar evento load después de cargar', async () => {
			class User extends Item<IUser, MockProvider> {
				constructor(specs: any = {}) {
					super({
						entity: 'users',
						provider: MockProvider,
						properties: ['id', 'name'],
						...specs,
					});
				}
			}

			const mockData = { id: '1', name: 'John' };
			const provider = new MockProvider(mockData);

			const user = new User({ id: '1' });
			(user as any)._provider = provider;

			const loadPromise = new Promise((resolve) => {
				user.on('load', (data) => {
					expect(data).toBeDefined();
					resolve(undefined);
				});
			});

			await user.load();
			await loadPromise;
		});
	});
});

