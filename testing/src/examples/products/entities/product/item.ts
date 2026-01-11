import { Item } from '@beyond-js/reactive/entities/item';
import { ProductProvider } from './provider';
import type { IProduct } from './types';

/**
 * Product Item with lifecycle hooks and computed properties
 *
 * Demonstrates:
 * - Lifecycle hooks (beforeLoad, afterLoad, beforePublish)
 * - Computed properties (isLowStock, formattedPrice)
 * - Change tracking
 */
export class Product extends Item<IProduct, ProductProvider> {
	declare id: string;
	declare name: string;
	declare price: number;
	declare description: string;
	declare categoryId: string;
	declare tagIds: string[];
	declare stock: number;
	declare imageUrl: string;
	declare createdAt: number;
	declare updatedAt: number;

	// Threshold for low stock warning
	static LOW_STOCK_THRESHOLD = 10;

	constructor(specs: Partial<IProduct> = {}) {
		super({
			entity: 'products',
			provider: ProductProvider,
			properties: [
				'id',
				'name',
				'price',
				'description',
				'categoryId',
				'tagIds',
				'stock',
				'imageUrl',
				'createdAt',
				'updatedAt',
			],
			computed: [
				{
					name: 'isLowStock',
					dependencies: ['stock'],
					compute: (self: unknown) => {
						const product = self as Product;
						return (product.stock ?? 0) < Product.LOW_STOCK_THRESHOLD;
					},
				},
				{
					name: 'formattedPrice',
					dependencies: ['price'],
					compute: (self: unknown) => {
						const product = self as Product;
						return new Intl.NumberFormat('es-ES', {
							style: 'currency',
							currency: 'USD',
						}).format(product.price ?? 0);
					},
				},
			],
			...specs,
		});
	}

	/**
	 * Lifecycle hook: Called before loading
	 * Logs the load operation for debugging
	 */
	protected async beforeLoad(args: unknown): Promise<unknown> {
		console.log(`[Product] beforeLoad:`, args);
		return args;
	}

	/**
	 * Lifecycle hook: Called after loading
	 * Can transform loaded data
	 */
	protected async afterLoad(data: IProduct): Promise<IProduct> {
		console.log(`[Product] afterLoad:`, data.name);
		return data;
	}

	/**
	 * Lifecycle hook: Called before publishing
	 * Adds updatedAt timestamp
	 */
	protected async beforePublish(data: Partial<IProduct>): Promise<Partial<IProduct>> {
		console.log(`[Product] beforePublish:`, data);
		return {
			...data,
			updatedAt: Date.now(),
		};
	}

	/**
	 * Lifecycle hook: Called after publishing
	 */
	protected async afterPublish(data: IProduct): Promise<void> {
		console.log(`[Product] afterPublish: ${data.name} saved successfully`);
	}

	/**
	 * Check if product has a specific tag
	 */
	hasTag(tagId: string): boolean {
		return this.tagIds?.includes(tagId) ?? false;
	}

	/**
	 * Add a tag to the product
	 */
	addTag(tagId: string): void {
		if (!this.hasTag(tagId)) {
			this.set({ tagIds: [...(this.tagIds || []), tagId] });
		}
	}

	/**
	 * Remove a tag from the product
	 */
	removeTag(tagId: string): void {
		if (this.hasTag(tagId)) {
			this.set({ tagIds: this.tagIds.filter(id => id !== tagId) });
		}
	}

	/**
	 * Update stock level
	 */
	updateStock(quantity: number): void {
		const newStock = Math.max(0, (this.stock ?? 0) + quantity);
		this.set({ stock: newStock });
	}
}
