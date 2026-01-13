import { ReactiveModel } from 'reactive/model';

interface IOrderItem {
	price: number;
	quantity: number;
}

interface IOrder {
	id: string;
	items: IOrderItem[];
	discount: number;
	total?: number;
	itemCount?: number;
}

describe('Computed Properties', () => {
	describe('Basic Computed Properties', () => {
		test('should define and compute a basic computed property', () => {
			const model = new ReactiveModel<IOrder>({
				properties: ['id', 'items', 'discount'],
				computed: [
					{
						name: 'total',
						dependencies: ['items', 'discount'],
						compute: (self: unknown) => {
							const order = self as { items: IOrderItem[]; discount: number };
							const items = order.items || [];
							const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
							return subtotal - (order.discount || 0);
						},
					},
				],
				id: '1',
				items: [
					{ price: 10, quantity: 2 },
					{ price: 5, quantity: 3 },
				],
				discount: 5,
			});

			// Total should be (10*2 + 5*3) - 5 = 20 + 15 - 5 = 30
			expect((model as unknown as { total: number }).total).toBe(30);
		});

		test('should recalculate when dependency changes', () => {
			const model = new ReactiveModel<IOrder>({
				properties: ['id', 'items', 'discount'],
				computed: [
					{
						name: 'total',
						dependencies: ['items', 'discount'],
						compute: (self: unknown) => {
							const order = self as { items: IOrderItem[]; discount: number };
							const items = order.items || [];
							const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
							return subtotal - (order.discount || 0);
						},
					},
				],
				id: '1',
				items: [{ price: 10, quantity: 1 }],
				discount: 0,
			});

			expect((model as unknown as { total: number }).total).toBe(10);

			// Change discount
			model.set({ discount: 2 });
			expect((model as unknown as { total: number }).total).toBe(8);

			// Change items
			model.set({ items: [{ price: 10, quantity: 2 }] });
			expect((model as unknown as { total: number }).total).toBe(18);
		});

		test('should cache computed values until dependencies change', () => {
			let computeCount = 0;

			const model = new ReactiveModel<IOrder>({
				properties: ['id', 'items', 'discount'],
				computed: [
					{
						name: 'total',
						dependencies: ['items', 'discount'],
						compute: (self: unknown) => {
							computeCount++;
							const order = self as { items: IOrderItem[]; discount: number };
							const items = order.items || [];
							return items.reduce((sum, item) => sum + item.price * item.quantity, 0) - (order.discount || 0);
						},
					},
				],
				id: '1',
				items: [{ price: 10, quantity: 1 }],
				discount: 0,
			});

			// First access - should compute
			const total1 = (model as unknown as { total: number }).total;
			expect(computeCount).toBe(1);

			// Second access - should use cache
			const total2 = (model as unknown as { total: number }).total;
			expect(computeCount).toBe(1);
			expect(total1).toBe(total2);

			// Change dependency - should recompute on next access
			model.set({ discount: 5 });
			const total3 = (model as unknown as { total: number }).total;
			expect(computeCount).toBe(2);
			expect(total3).toBe(5);
		});

		test('should emit change event for computed property when dependency changes', (done) => {
			const model = new ReactiveModel<IOrder>({
				properties: ['id', 'items', 'discount'],
				computed: [
					{
						name: 'total',
						dependencies: ['discount'],
						compute: (self: unknown) => {
							const order = self as { discount: number };
							return 100 - (order.discount || 0);
						},
					},
				],
				id: '1',
				discount: 0,
			});

			model.on('total.changed', ({ value, previous }) => {
				expect(previous).toBe(100);
				expect(value).toBe(90);
				done();
			});

			model.set({ discount: 10 });
		});
	});

	describe('Multiple Computed Properties', () => {
		test('should support multiple computed properties', () => {
			const model = new ReactiveModel<IOrder>({
				properties: ['id', 'items', 'discount'],
				computed: [
					{
						name: 'itemCount',
						dependencies: ['items'],
						compute: (self: unknown) => {
							const order = self as { items: IOrderItem[] };
							return (order.items || []).length;
						},
					},
					{
						name: 'total',
						dependencies: ['items', 'discount'],
						compute: (self: unknown) => {
							const order = self as { items: IOrderItem[]; discount: number };
							const items = order.items || [];
							const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
							return subtotal - (order.discount || 0);
						},
					},
				],
				id: '1',
				items: [
					{ price: 10, quantity: 1 },
					{ price: 20, quantity: 1 },
				],
				discount: 5,
			});

			expect((model as unknown as { itemCount: number }).itemCount).toBe(2);
			expect((model as unknown as { total: number }).total).toBe(25);
		});
	});

	describe('Edge Cases', () => {
		test('should handle computed property with undefined dependencies', () => {
			const model = new ReactiveModel<IOrder>({
				properties: ['id', 'discount'],
				computed: [
					{
						name: 'total',
						dependencies: ['discount'],
						compute: (self: unknown) => {
							const order = self as { discount?: number };
							return 100 - (order.discount ?? 0);
						},
					},
				],
				id: '1',
			});

			expect((model as unknown as { total: number }).total).toBe(100);
		});

		test('should handle empty dependencies array', () => {
			let computeCount = 0;

			const model = new ReactiveModel<IOrder>({
				properties: ['id'],
				computed: [
					{
						name: 'total',
						dependencies: [],
						compute: () => {
							computeCount++;
							return 42;
						},
					},
				],
				id: '1',
			});

			expect((model as unknown as { total: number }).total).toBe(42);
			expect((model as unknown as { total: number }).total).toBe(42);
			// Should only compute once since no dependencies can change
			expect(computeCount).toBe(1);
		});
	});
});
