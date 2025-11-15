import { ReactiveModel } from '@beyond-js/reactive/model';
import { z } from 'zod';

// Test interface
interface ITestModel {
	id: string;
	name: string;
	email?: string;
	age?: number;
}

describe('ReactiveModel - Bundle Tests', () => {
	describe('Instanciación básica', () => {
		test('debe crear una instancia de ReactiveModel desde bundle', () => {
			const model = new ReactiveModel<ITestModel>({
				properties: ['id', 'name'],
			});

			expect(model).toBeInstanceOf(ReactiveModel);
			expect(model.isReactive).toBe(true);
		});

		test('debe inicializar con valores desde bundle', () => {
			const model = new ReactiveModel<ITestModel>({
				properties: ['id', 'name'],
				id: '1',
				name: 'Test',
			});

			expect(model.id).toBe('1');
			expect(model.name).toBe('Test');
		});
	});

	describe('Funcionalidad básica', () => {
		test('debe actualizar propiedades con set() desde bundle', () => {
			const model = new ReactiveModel<ITestModel>({
				properties: ['id', 'name'],
				id: '1',
				name: 'Test',
			});

			const result = model.set({ name: 'Updated' });

			expect(result.updated).toBe(true);
			expect(model.name).toBe('Updated');
		});

		test('debe retornar propiedades con getProperties() desde bundle', () => {
			const model = new ReactiveModel<ITestModel>({
				properties: ['id', 'name', 'email'],
				id: '1',
				name: 'Test',
				email: 'test@example.com',
			});

			const props = model.getProperties();

			expect(props.id).toBe('1');
			expect(props.name).toBe('Test');
			expect(props.email).toBe('test@example.com');
		});
	});

	describe('Estados', () => {
		test('debe manejar estado ready desde bundle', (done) => {
			const model = new ReactiveModel<ITestModel>({
				properties: ['id', 'name'],
			});

			model.on('ready', () => {
				expect(model.ready).toBe(true);
				done();
			});

			model.ready = true;
		});

		test('debe detectar cambios sin publicar desde bundle', () => {
			const model = new ReactiveModel<ITestModel>({
				properties: ['id', 'name'],
				id: '1',
				name: 'Test',
			});

			model.set({ name: 'Updated' });

			expect(model.unpublished).toBe(true);
		});
	});
});

