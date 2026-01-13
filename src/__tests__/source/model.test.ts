import { ReactiveModel } from 'reactive/model';
import { z } from 'zod';

// Test interface
interface ITestModel {
	id: string;
	name: string;
	email?: string;
	age?: number;
}

describe('ReactiveModel - Source Code Tests', () => {
	describe('Instanciación básica', () => {
		test('debe crear una instancia de ReactiveModel', () => {
			const model = new ReactiveModel<ITestModel>({
				properties: ['id', 'name'],
			});

			expect(model).toBeInstanceOf(ReactiveModel);
			expect(model.isReactive).toBe(true);
			expect(ReactiveModel.isReactive()).toBe(true);
		});

		test('debe inicializar con valores por defecto', () => {
			const model = new ReactiveModel<ITestModel>({
				properties: ['id', 'name'],
				id: '1',
				name: 'Test',
			}) as any;

			expect(model.id).toBe('1');
			expect(model.name).toBe('Test');
		});
	});

	describe('Propiedades reactivas', () => {
		test('debe definir propiedades reactivas correctamente', () => {
			const model = new ReactiveModel<ITestModel>({
				properties: ['id', 'name', 'email'],
			});

			expect(model.propertyNames.has('id')).toBe(true);
			expect(model.propertyNames.has('name')).toBe(true);
			expect(model.propertyNames.has('email')).toBe(true);
		});

		test('debe permitir acceso directo a propiedades', () => {
			const model = new ReactiveModel<ITestModel>({
				properties: ['id', 'name'],
				id: '1',
				name: 'Test',
			}) as any;

			expect(model.id).toBe('1');
			expect(model.name).toBe('Test');
		});

		test('debe permitir acceso mediante getProperty (acceso dinámico)', () => {
			const model = new ReactiveModel<ITestModel>({
				properties: ['id', 'name'],
				id: '1',
				name: 'Test',
			});

			// getProperty es útil para acceso dinámico cuando el nombre viene de una variable
			const propName = 'id' as keyof ITestModel;
			expect(model.getProperty(propName)).toBe('1');
			expect(model.getProperty('name')).toBe('Test');
		});
	});

	describe('Método set()', () => {
		test('debe actualizar propiedades con set()', () => {
			const model = new ReactiveModel<ITestModel>({
				properties: ['id', 'name'],
				id: '1',
				name: 'Test',
			}) as any;

			const result = model.set({ name: 'Updated' });

			expect(result.updated).toBe(true);
			expect(model.name).toBe('Updated');
		});

		test('debe disparar eventos al actualizar propiedades', (done) => {
			const model = new ReactiveModel<ITestModel>({
				properties: ['id', 'name'],
				id: '1',
				name: 'Test',
			});

			model.on('name.changed', ({ value }) => {
				expect(value).toBe('Updated');
				done();
			});

			model.set({ name: 'Updated' });
		});

		test('debe disparar evento change al actualizar', (done) => {
			const model = new ReactiveModel<ITestModel>({
				properties: ['id', 'name'],
				id: '1',
				name: 'Test',
			});

			model.on('change', () => {
				done();
			});

			model.set({ name: 'Updated' });
		});

		test('no debe actualizar si el valor es el mismo', () => {
			const model = new ReactiveModel<ITestModel>({
				properties: ['id', 'name'],
				id: '1',
				name: 'Test',
			});

			const result = model.set({ name: 'Test' });

			expect(result.updated).toBe(false);
		});
	});

	describe('Método getProperties()', () => {
		test('debe retornar todas las propiedades con getProperties()', () => {
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

	describe('Estados y flags', () => {
		test('debe manejar estado ready', (done) => {
			const model = new ReactiveModel<ITestModel>({
				properties: ['id', 'name'],
			});

			model.on('ready', () => {
				expect(model.ready).toBe(true);
				done();
			});

			model.ready = true;
		});

		test('debe detectar isDraft correctamente', () => {
			const model = new ReactiveModel<ITestModel>({
				properties: ['id', 'name'],
			});

			expect(model.isDraft).toBe(true);
		});

		test('debe detectar unpublished cuando hay cambios', () => {
			const model = new ReactiveModel<ITestModel>({
				properties: ['id', 'name'],
				id: '1',
				name: 'Test',
			});

			model.set({ name: 'Updated' });

			expect(model.unpublished).toBe(true);
		});

		test('debe detectar que no hay cambios sin publicar', () => {
			const model = new ReactiveModel<ITestModel>({
				properties: ['id', 'name'],
				id: '1',
				name: 'Test',
			});

			expect(model.unpublished).toBe(false);
		});
	});

	describe('Métodos revert() y saveChanges()', () => {
		test('debe revertir cambios con revert()', () => {
			const model = new ReactiveModel<ITestModel>({
				properties: ['id', 'name'],
				id: '1',
				name: 'Test',
			}) as any;

			model.set({ name: 'Updated' });
			expect(model.name).toBe('Updated');

			model.revert();
			expect(model.name).toBe('Test');
		});

		test('debe guardar cambios con saveChanges()', () => {
			const model = new ReactiveModel<ITestModel>({
				properties: ['id', 'name'],
				id: '1',
				name: 'Test',
			});

			model.set({ name: 'Updated' });
			model.saveChanges();

			expect(model.unpublished).toBe(false);
			expect(model.isDraft).toBe(false);
		});
	});

	describe('Validación con Zod', () => {
		test('debe validar propiedades con schema Zod', () => {
			const schema = z.object({
				name: z.string().min(3),
				age: z.number().min(18),
			});

			class ValidatedModel extends ReactiveModel<{ name: string; age: number }> {
				protected schema = schema;
			}

			const model = new ValidatedModel({
				properties: ['name', 'age'],
			} as any);

			const validation = model.validate({ name: 'Jo', age: 15 });

			expect(validation.valid).toBe(false);
			expect(validation.errors).toBeDefined();
		});

		test('debe pasar validación con datos válidos', () => {
			const schema = z.object({
				name: z.string().min(3),
				age: z.number().min(18),
			});

			class ValidatedModel extends ReactiveModel<{ name: string; age: number }> {
				protected schema = schema;
			}

			const model = new ValidatedModel({
				properties: ['name', 'age'],
			} as any);

			const validation = model.validate({ name: 'John', age: 25 });

			expect(validation.valid).toBe(true);
		});
	});

	describe('Eventos', () => {
		test('debe disparar eventos de propiedad específica', (done) => {
			const model = new ReactiveModel<ITestModel>({
				properties: ['id', 'name'],
				id: '1',
				name: 'Test',
			});

			model.on('name.changed', ({ value, previous }) => {
				expect(value).toBe('Updated');
				expect(previous).toBe('Test');
				done();
			});

			model.set({ name: 'Updated' });
		});

		test('debe permitir remover listeners', () => {
			const model = new ReactiveModel<ITestModel>({
				properties: ['id', 'name'],
			});

			const handler = jest.fn();
			model.on('change', handler);

			model.off('change', handler);
			model.set({ name: 'Test' });

			expect(handler).not.toHaveBeenCalled();
		});
	});
});

