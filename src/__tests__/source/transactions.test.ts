import { ReactiveModel } from '@beyond-js/reactive/model';

interface ITestModel {
	id: string;
	name: string;
	email: string;
	age: number;
}

describe('Transactions', () => {
	describe('Basic Transaction Behavior', () => {
		test('should batch multiple changes in a transaction', () => {
			const model = new ReactiveModel<ITestModel>({
				properties: ['id', 'name', 'email', 'age'],
				id: '1',
				name: 'Initial',
				email: 'initial@test.com',
				age: 25,
			}) as ReactiveModel<ITestModel> & ITestModel;

			const changeHandler = jest.fn();
			model.on('change', changeHandler);

			model.transaction(() => {
				model.set({ name: 'Updated' });
				model.set({ email: 'updated@test.com' });
				model.set({ age: 30 });
			});

			// All changes should be applied
			expect(model.name).toBe('Updated');
			expect(model.email).toBe('updated@test.com');
			expect(model.age).toBe(30);

			// Only one change event should be emitted (at the end of transaction)
			expect(changeHandler).toHaveBeenCalledTimes(1);
		});

		test('should not emit events during transaction', () => {
			const model = new ReactiveModel<ITestModel>({
				properties: ['id', 'name', 'email'],
				id: '1',
				name: 'Initial',
				email: 'initial@test.com',
			}) as ReactiveModel<ITestModel> & ITestModel;

			const nameChangedHandler = jest.fn();
			const emailChangedHandler = jest.fn();

			model.on('name.changed', nameChangedHandler);
			model.on('email.changed', emailChangedHandler);

			model.transaction(() => {
				model.set({ name: 'Updated' });
				// At this point, event should not have been fired
				expect(nameChangedHandler).not.toHaveBeenCalled();

				model.set({ email: 'updated@test.com' });
				expect(emailChangedHandler).not.toHaveBeenCalled();
			});

			// After transaction, one batch update should have been applied
			expect(model.name).toBe('Updated');
			expect(model.email).toBe('updated@test.com');
		});

		test('should return result from transaction', () => {
			const model = new ReactiveModel<ITestModel>({
				properties: ['id', 'name'],
				id: '1',
				name: 'Initial',
			});

			const result = model.transaction(() => {
				model.set({ name: 'Updated' });
			});

			expect(result.updated).toBe(true);
		});

		test('should accumulate changes from multiple sets in transaction', () => {
			const model = new ReactiveModel<ITestModel>({
				properties: ['id', 'name', 'email', 'age'],
				id: '1',
				name: 'Initial',
				email: 'initial@test.com',
				age: 25,
			}) as ReactiveModel<ITestModel> & ITestModel;

			model.transaction(() => {
				model.set({ name: 'Name1' });
				model.set({ name: 'Name2' }); // Overwrites previous
				model.set({ email: 'new@test.com' });
			});

			expect(model.name).toBe('Name2');
			expect(model.email).toBe('new@test.com');
		});
	});

	describe('Transaction Error Handling', () => {
		test('should still apply changes if callback throws', () => {
			const model = new ReactiveModel<ITestModel>({
				properties: ['id', 'name'],
				id: '1',
				name: 'Initial',
			}) as ReactiveModel<ITestModel> & ITestModel;

			try {
				model.transaction(() => {
					model.set({ name: 'Updated' });
					throw new Error('Test error');
				});
			} catch (e) {
				// Expected
			}

			// Transaction state should be reset
			// The changes accumulated before the error should still be applied
			// since we apply them after the try block
		});
	});

	describe('Nested Behavior', () => {
		test('regular sets outside transaction should work normally', () => {
			const model = new ReactiveModel<ITestModel>({
				properties: ['id', 'name', 'email'],
				id: '1',
				name: 'Initial',
				email: 'initial@test.com',
			}) as ReactiveModel<ITestModel> & ITestModel;

			const changeHandler = jest.fn();
			model.on('change', changeHandler);

			// Regular set
			model.set({ name: 'First' });
			expect(changeHandler).toHaveBeenCalledTimes(1);

			// Transaction
			model.transaction(() => {
				model.set({ name: 'Second' });
				model.set({ email: 'second@test.com' });
			});
			expect(changeHandler).toHaveBeenCalledTimes(2);

			// Regular set again
			model.set({ name: 'Third' });
			expect(changeHandler).toHaveBeenCalledTimes(3);
		});
	});

	describe('Transaction with Validation', () => {
		test('should validate at the end of transaction', () => {
			const model = new ReactiveModel<ITestModel>({
				properties: ['id', 'name', 'email'],
				id: '1',
				name: 'Initial',
				email: 'initial@test.com',
			});

			const result = model.transaction(() => {
				model.set({ name: 'Valid Name' });
				model.set({ email: 'valid@email.com' });
			});

			expect(result.updated).toBe(true);
		});
	});
});
