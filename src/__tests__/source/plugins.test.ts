import { PluginManager, IReactivePlugin } from 'reactive/model';
import { Item } from 'reactive/entities/item';
import { Collection } from 'reactive/entities/collection';

interface ITestItem {
	id: string;
	name: string;
	email?: string;
}

// Mock Provider
class MockProvider {
	constructor(private parent: unknown) {}

	async load(specs?: unknown): Promise<ITestItem> {
		return { id: '1', name: 'Loaded Name', email: 'loaded@test.com' };
	}

	async publish(data: Partial<ITestItem>): Promise<{ status: number; data: ITestItem }> {
		return { status: 200, data: { id: '1', ...data } as ITestItem };
	}

	async delete(id: string): Promise<boolean> {
		return true;
	}
}

// Mock Collection Provider
class MockCollectionProvider {
	constructor(private parent: unknown) {}

	async list(specs?: unknown): Promise<ITestItem[]> {
		return [
			{ id: '1', name: 'Item 1' },
			{ id: '2', name: 'Item 2' },
		];
	}
}

// Test Item class
class TestItem extends Item<ITestItem, MockProvider> {
	declare name: string;
	declare email: string;

	constructor(specs: Partial<ITestItem> = {}) {
		super({
			entity: 'plugin-test-items',
			provider: MockProvider,
			properties: ['id', 'name', 'email'],
			...specs,
		});
	}
}

// Test Collection class
class TestCollection extends Collection<TestItem, MockCollectionProvider> {
	constructor() {
		super({
			entity: 'plugin-test-items',
			provider: MockCollectionProvider,
			item: TestItem,
		});
	}
}

describe('Plugin System', () => {
	beforeEach(() => {
		// Clear all plugins before each test
		PluginManager.clear();
	});

	describe('Plugin Registration', () => {
		test('should register a global plugin', () => {
			const plugin: IReactivePlugin = {
				name: 'test-plugin',
			};

			PluginManager.register(plugin);

			expect(PluginManager.hasPlugin('test-plugin')).toBe(true);
		});

		test('should register a plugin for specific entities', () => {
			const plugin: IReactivePlugin = {
				name: 'entity-plugin',
			};

			PluginManager.register(plugin, { entities: ['users', 'products'] });

			expect(PluginManager.hasPlugin('entity-plugin', 'users')).toBe(true);
			expect(PluginManager.hasPlugin('entity-plugin', 'products')).toBe(true);
			expect(PluginManager.hasPlugin('entity-plugin', 'orders')).toBe(false);
		});

		test('should unregister a plugin', () => {
			const plugin: IReactivePlugin = {
				name: 'test-plugin',
			};

			PluginManager.register(plugin);
			expect(PluginManager.hasPlugin('test-plugin')).toBe(true);

			PluginManager.unregister('test-plugin');
			expect(PluginManager.hasPlugin('test-plugin')).toBe(false);
		});

		test('should throw error if plugin has no name', () => {
			const plugin = {} as IReactivePlugin;

			expect(() => PluginManager.register(plugin)).toThrow('Plugin must have a name');
		});
	});

	describe('Plugin Execution Order', () => {
		test('should execute plugins by priority (higher first)', async () => {
			const executionOrder: string[] = [];

			PluginManager.register({
				name: 'low-priority',
				priority: 1,
				onBeforeLoad: async (item, args) => {
					executionOrder.push('low');
					return args;
				},
			});

			PluginManager.register({
				name: 'high-priority',
				priority: 100,
				onBeforeLoad: async (item, args) => {
					executionOrder.push('high');
					return args;
				},
			});

			PluginManager.register({
				name: 'medium-priority',
				priority: 50,
				onBeforeLoad: async (item, args) => {
					executionOrder.push('medium');
					return args;
				},
			});

			const item = new TestItem({ id: '1' });
			await item.load();

			expect(executionOrder).toEqual(['high', 'medium', 'low']);
		});
	});

	describe('Plugin Hooks - Item', () => {
		test('should run onBeforeLoad plugin hook', async () => {
			const beforeLoadMock = jest.fn((item, args) => args);

			PluginManager.register({
				name: 'before-load-plugin',
				onBeforeLoad: beforeLoadMock,
			});

			const item = new TestItem({ id: '1' });
			await item.load();

			expect(beforeLoadMock).toHaveBeenCalled();
		});

		test('should run onAfterLoad plugin hook', async () => {
			const afterLoadMock = jest.fn((item, data) => data);

			PluginManager.register({
				name: 'after-load-plugin',
				onAfterLoad: afterLoadMock,
			});

			const item = new TestItem({ id: '1' });
			await item.load();

			expect(afterLoadMock).toHaveBeenCalled();
		});

		test('should allow plugin to transform data in onAfterLoad', async () => {
			PluginManager.register({
				name: 'transform-plugin',
				onAfterLoad: async (item, data: ITestItem) => ({
					...data,
					name: `[Plugin] ${data.name}`,
				}),
			});

			const item = new TestItem({ id: '1' });
			await item.load();

			expect(item.name).toContain('[Plugin]');
		});

		test('should run onBeforePublish plugin hook', async () => {
			const beforePublishMock = jest.fn((item, data) => data);

			PluginManager.register({
				name: 'before-publish-plugin',
				onBeforePublish: beforePublishMock,
			});

			const item = new TestItem({ id: '1', name: 'Test' });
			await item.publish();

			expect(beforePublishMock).toHaveBeenCalled();
		});

		test('should run onAfterPublish plugin hook', async () => {
			const afterPublishMock = jest.fn();

			PluginManager.register({
				name: 'after-publish-plugin',
				onAfterPublish: afterPublishMock,
			});

			const item = new TestItem({ id: '1', name: 'Test' });
			await item.publish();

			expect(afterPublishMock).toHaveBeenCalled();
		});

		test('should run onBeforeDelete plugin hook', async () => {
			const beforeDeleteMock = jest.fn((item, id) => true);

			PluginManager.register({
				name: 'before-delete-plugin',
				onBeforeDelete: beforeDeleteMock,
			});

			const item = new TestItem({ id: '1', name: 'Test' });
			await item.delete();

			expect(beforeDeleteMock).toHaveBeenCalled();
		});

		test('should allow plugin to cancel delete', async () => {
			PluginManager.register({
				name: 'cancel-delete-plugin',
				onBeforeDelete: async () => false,
			});

			const item = new TestItem({ id: '1', name: 'Test' });
			const result = await item.delete();

			expect(result).toBe(false);
		});

		test('should run onAfterDelete plugin hook', async () => {
			const afterDeleteMock = jest.fn();

			PluginManager.register({
				name: 'after-delete-plugin',
				onAfterDelete: afterDeleteMock,
			});

			const item = new TestItem({ id: '1', name: 'Test' });
			await item.delete();

			expect(afterDeleteMock).toHaveBeenCalled();
		});
	});

	describe('Plugin Hooks - Collection', () => {
		test('should run onBeforeList plugin hook', async () => {
			const beforeListMock = jest.fn((collection, specs) => specs);

			PluginManager.register({
				name: 'before-list-plugin',
				onBeforeList: beforeListMock,
			});

			const collection = new TestCollection();
			await collection.load();

			expect(beforeListMock).toHaveBeenCalled();
		});

		test('should run onAfterList plugin hook', async () => {
			const afterListMock = jest.fn((collection, items) => items);

			PluginManager.register({
				name: 'after-list-plugin',
				onAfterList: afterListMock,
			});

			const collection = new TestCollection();
			await collection.load();

			expect(afterListMock).toHaveBeenCalled();
		});

		test('should allow plugin to transform items in onAfterList', async () => {
			PluginManager.register({
				name: 'filter-plugin',
				onAfterList: async (collection, items: ITestItem[]) => {
					return items.filter((item) => item.id === '1');
				},
			});

			const collection = new TestCollection();
			await collection.load();

			expect(collection.items.length).toBe(1);
		});
	});

	describe('Entity-Specific Plugins', () => {
		test('should only run plugin for matching entity', async () => {
			const pluginMock = jest.fn((item, args) => args);

			PluginManager.register(
				{
					name: 'entity-specific-plugin',
					onBeforeLoad: pluginMock,
				},
				{ entities: ['other-entity'] }
			);

			const item = new TestItem({ id: '1' });
			await item.load();

			// Plugin should not be called because entity doesn't match
			expect(pluginMock).not.toHaveBeenCalled();
		});

		test('should run plugin for matching entity', async () => {
			const pluginMock = jest.fn((item, args) => args);

			PluginManager.register(
				{
					name: 'entity-specific-plugin',
					onBeforeLoad: pluginMock,
				},
				{ entities: ['plugin-test-items'] }
			);

			const item = new TestItem({ id: '1' });
			await item.load();

			expect(pluginMock).toHaveBeenCalled();
		});
	});

	describe('Plugin Error Handling', () => {
		test('should continue execution if plugin throws error', async () => {
			const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

			PluginManager.register({
				name: 'error-plugin',
				priority: 100,
				onBeforeLoad: async () => {
					throw new Error('Plugin error');
				},
			});

			PluginManager.register({
				name: 'working-plugin',
				priority: 50,
				onBeforeLoad: async (item, args) => args,
			});

			const item = new TestItem({ id: '1' });

			// Should not throw
			await expect(item.load()).resolves.toBeDefined();

			consoleSpy.mockRestore();
		});
	});

	describe('Plugin Manager Utilities', () => {
		test('should get all plugins for an entity', () => {
			PluginManager.register({ name: 'global-plugin' });
			PluginManager.register({ name: 'entity-plugin' }, { entities: ['users'] });

			const plugins = PluginManager.getPlugins('users');

			expect(plugins.length).toBe(2);
		});

		test('should clear all plugins', () => {
			PluginManager.register({ name: 'plugin-1' });
			PluginManager.register({ name: 'plugin-2' });

			PluginManager.clear();

			expect(PluginManager.getPlugins().length).toBe(0);
		});
	});
});
