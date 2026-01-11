import { ReactiveModel, SetPropertiesResult } from '@beyond-js/reactive/model';
import { Item } from '@beyond-js/reactive/entities/item';
import { Collection } from '@beyond-js/reactive/entities/collection';

// Test interfaces
interface ITestModel {
	id: string;
	name: string;
	email?: string;
}

interface ITestItem extends ITestModel {
	id: string;
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

describe('Lifecycle Hooks', () => {
	describe('ReactiveModel Hooks', () => {
		test('should call beforeSet hook before setting properties', async () => {
			const beforeSetMock = jest.fn((props: Partial<ITestModel>) => ({
				...props,
				name: `Modified: ${props.name}`,
			}));

			class HookedModel extends ReactiveModel<ITestModel> {
				protected async beforeSet(properties: Partial<ITestModel>): Promise<Partial<ITestModel>> {
					return beforeSetMock(properties);
				}
			}

			const model = new HookedModel({
				properties: ['id', 'name'],
				id: '1',
				name: 'Initial',
			});

			await model.setAsync({ name: 'Test' });

			expect(beforeSetMock).toHaveBeenCalledWith({ name: 'Test' });
			expect((model as unknown as { name: string }).name).toBe('Modified: Test');
		});

		test('should call afterSet hook after setting properties', async () => {
			const afterSetMock = jest.fn();

			class HookedModel extends ReactiveModel<ITestModel> {
				protected async afterSet(
					properties: Partial<ITestModel>,
					result: SetPropertiesResult
				): Promise<void> {
					afterSetMock(properties, result);
				}
			}

			const model = new HookedModel({
				properties: ['id', 'name'],
				id: '1',
				name: 'Initial',
			});

			await model.setAsync({ name: 'Updated' });

			expect(afterSetMock).toHaveBeenCalled();
			expect(afterSetMock.mock.calls[0][1].updated).toBe(true);
		});

		test('should emit pre:set and post:set events', async () => {
			const preSetHandler = jest.fn();
			const postSetHandler = jest.fn();

			const model = new ReactiveModel<ITestModel>({
				properties: ['id', 'name'],
				id: '1',
				name: 'Initial',
			});

			model.on('pre:set', preSetHandler);
			model.on('post:set', postSetHandler);

			await model.setAsync({ name: 'Updated' });

			expect(preSetHandler).toHaveBeenCalled();
			expect(postSetHandler).toHaveBeenCalled();
		});
	});

	describe('Item Lifecycle Hooks', () => {
		class TestItem extends Item<ITestItem, MockProvider> {
			declare name: string;
			declare email: string;

			public beforeLoadCalled = false;
			public afterLoadCalled = false;
			public beforePublishCalled = false;
			public afterPublishCalled = false;
			public beforeDeleteCalled = false;
			public afterDeleteCalled = false;

			constructor(specs: Partial<ITestItem> = {}) {
				super({
					entity: 'test-items',
					provider: MockProvider,
					properties: ['id', 'name', 'email'],
					...specs,
				});
			}

			protected async beforeLoad(args: unknown): Promise<unknown> {
				this.beforeLoadCalled = true;
				return args;
			}

			protected async afterLoad(data: ITestItem): Promise<ITestItem> {
				this.afterLoadCalled = true;
				return { ...data, name: `${data.name} (processed)` };
			}

			protected async beforePublish(data: Partial<ITestItem>): Promise<Partial<ITestItem>> {
				this.beforePublishCalled = true;
				return { ...data, email: data.email?.toLowerCase() };
			}

			protected async afterPublish(data: ITestItem): Promise<void> {
				this.afterPublishCalled = true;
			}

			protected async beforeDelete(id: string | number): Promise<boolean> {
				this.beforeDeleteCalled = true;
				return true;
			}

			protected async afterDelete(id: string | number): Promise<void> {
				this.afterDeleteCalled = true;
			}
		}

		test('should call beforeLoad and afterLoad hooks', async () => {
			const item = new TestItem({ id: '1' });

			await item.load();

			expect(item.beforeLoadCalled).toBe(true);
			expect(item.afterLoadCalled).toBe(true);
			expect(item.name).toBe('Loaded Name (processed)');
		});

		test('should call beforePublish and afterPublish hooks', async () => {
			const item = new TestItem({ id: '1', name: 'Test', email: 'TEST@EMAIL.COM' });

			await item.publish();

			expect(item.beforePublishCalled).toBe(true);
			expect(item.afterPublishCalled).toBe(true);
		});

		test('should call beforeDelete and afterDelete hooks', async () => {
			const item = new TestItem({ id: '1', name: 'Test' });

			await item.delete();

			expect(item.beforeDeleteCalled).toBe(true);
			expect(item.afterDeleteCalled).toBe(true);
		});

		test('should emit pre:load and post:load events', async () => {
			const item = new TestItem({ id: '1' });
			const preLoadHandler = jest.fn();
			const postLoadHandler = jest.fn();

			item.on('pre:load', preLoadHandler);
			item.on('post:load', postLoadHandler);

			await item.load();

			expect(preLoadHandler).toHaveBeenCalled();
			expect(postLoadHandler).toHaveBeenCalled();
		});

		test('should emit pre:publish and post:publish events', async () => {
			const item = new TestItem({ id: '1', name: 'Test' });
			const prePublishHandler = jest.fn();
			const postPublishHandler = jest.fn();

			item.on('pre:publish', prePublishHandler);
			item.on('post:publish', postPublishHandler);

			await item.publish();

			expect(prePublishHandler).toHaveBeenCalled();
			expect(postPublishHandler).toHaveBeenCalled();
		});

		test('should emit pre:delete and post:delete events', async () => {
			const item = new TestItem({ id: '1', name: 'Test' });
			const preDeleteHandler = jest.fn();
			const postDeleteHandler = jest.fn();

			item.on('pre:delete', preDeleteHandler);
			item.on('post:delete', postDeleteHandler);

			await item.delete();

			expect(preDeleteHandler).toHaveBeenCalled();
			expect(postDeleteHandler).toHaveBeenCalled();
		});

		test('should cancel delete if beforeDelete returns false', async () => {
			class CancelableItem extends Item<ITestItem, MockProvider> {
				constructor(specs: Partial<ITestItem> = {}) {
					super({
						entity: 'cancelable-items',
						provider: MockProvider,
						properties: ['id', 'name'],
						...specs,
					});
				}

				protected async beforeDelete(id: string | number): Promise<boolean> {
					return false; // Cancel deletion
				}
			}

			const item = new CancelableItem({ id: '1', name: 'Test' });
			const result = await item.delete();

			expect(result).toBe(false);
		});
	});

	describe('Collection Lifecycle Hooks', () => {
		class TestCollection extends Collection<TestItem, MockCollectionProvider> {
			public beforeLoadCalled = false;
			public afterLoadCalled = false;

			constructor() {
				super({
					entity: 'test-items',
					provider: MockCollectionProvider,
					item: TestItem,
				});
			}

			protected async beforeLoad(args: unknown): Promise<unknown> {
				this.beforeLoadCalled = true;
				return args;
			}

			protected async afterLoad(items: TestItem[]): Promise<TestItem[]> {
				this.afterLoadCalled = true;
				return items;
			}
		}

		class TestItem extends Item<ITestItem> {
			constructor(specs: Partial<ITestItem> = {}) {
				super({
					entity: 'test-items',
					properties: ['id', 'name'],
					...specs,
				});
			}
		}

		test('should call beforeLoad and afterLoad hooks on collection', async () => {
			const collection = new TestCollection();

			await collection.load();

			expect(collection.beforeLoadCalled).toBe(true);
			expect(collection.afterLoadCalled).toBe(true);
		});

		test('should emit pre:load and post:load events on collection', async () => {
			const collection = new TestCollection();
			const preLoadHandler = jest.fn();
			const postLoadHandler = jest.fn();

			collection.on('pre:load', preLoadHandler);
			collection.on('post:load', postLoadHandler);

			await collection.load();

			expect(preLoadHandler).toHaveBeenCalled();
			expect(postLoadHandler).toHaveBeenCalled();
		});
	});
});
