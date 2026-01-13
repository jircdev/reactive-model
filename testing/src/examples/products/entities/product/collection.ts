import { Collection } from 'reactive/entities/collection';
import { Product } from './item';
import { ProductProvider } from './provider';

/**
 * Products Collection with lifecycle hooks
 */
export class Products extends Collection<Product, ProductProvider> {
	constructor() {
		super({
			entity: 'products',
			provider: ProductProvider,
			item: Product,
			defaultLimit: 20,
		});
	}

	/**
	 * Lifecycle hook: Called before loading
	 */
	protected async beforeLoad(args: unknown): Promise<unknown> {
		console.log('[Products] beforeLoad:', args);
		return args;
	}

	/**
	 * Lifecycle hook: Called after loading
	 */
	protected async afterLoad(items: Product[]): Promise<Product[]> {
		console.log(`[Products] afterLoad: Loaded ${items.length} products`);
		return items;
	}

	/**
	 * Get products by category
	 */
	getByCategory(categoryId: string): Product[] {
		return this.items.filter(product => product.categoryId === categoryId);
	}

	/**
	 * Get products that have any of the specified tags
	 */
	getByTags(tagIds: string[]): Product[] {
		if (tagIds.length === 0) return this.items;
		return this.items.filter(product => tagIds.some(tagId => product.hasTag(tagId)));
	}

	/**
	 * Get products with low stock
	 */
	getLowStock(): Product[] {
		return this.items.filter(product => (product as unknown as { isLowStock: boolean }).isLowStock);
	}

	/**
	 * Get total value of inventory
	 */
	getTotalInventoryValue(): number {
		return this.items.reduce((total, product) => total + product.price * product.stock, 0);
	}

	/**
	 * Search products by name
	 */
	search(query: string): Product[] {
		const lowerQuery = query.toLowerCase();
		return this.items.filter(
			product =>
				product.name.toLowerCase().includes(lowerQuery) ||
				product.description.toLowerCase().includes(lowerQuery)
		);
	}
}
