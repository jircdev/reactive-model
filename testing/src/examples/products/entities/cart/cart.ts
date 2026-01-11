import { ReactiveModel } from '@beyond-js/reactive/model';
import type { ICart, ICartItem } from './types';
import type { Product } from '../product';

/**
 * Cart Model
 *
 * Demonstrates:
 * - ReactiveModel for client-side state (no provider needed)
 * - Computed properties (total, itemCount)
 * - Event-driven updates
 * - Methods that trigger reactive updates
 */
export class Cart extends ReactiveModel<ICart> {
	declare items: ICartItem[];

	constructor() {
		super({
			properties: ['items'],
			// Initialize items with empty array to prevent undefined errors
			items: [],
			computed: [
				{
					name: 'total',
					dependencies: ['items'],
					compute: (self: unknown) => {
						const cart = self as Cart;
						// Safety check: ensure items is always an array
						const items = cart.items || [];
						return items.reduce((sum, item) => {
							const product = item.product;
							if (!product) return sum;
							return sum + product.price * item.quantity;
						}, 0);
					},
				},
				{
					name: 'itemCount',
					dependencies: ['items'],
					compute: (self: unknown) => {
						const cart = self as Cart;
						// Safety check: ensure items is always an array
						const items = cart.items || [];
						return items.reduce((sum, item) => sum + item.quantity, 0);
					},
				},
			],
		});
	}

	/**
	 * Add a product to the cart
	 * If the product already exists, increases its quantity
	 */
	addProduct(product: Product, quantity: number = 1): void {
		const currentItems = this.items || [];
		const existingIndex = currentItems.findIndex(item => item.productId === product.id);

		if (existingIndex >= 0) {
			// Product already in cart, update quantity
			const updatedItems = [...currentItems];
			updatedItems[existingIndex] = {
				...updatedItems[existingIndex],
				quantity: updatedItems[existingIndex].quantity + quantity,
				product: product, // Update product reference
			};
			this.set({ items: updatedItems });
		} else {
			// New product, add to cart
			const newItem: ICartItem = {
				productId: product.id,
				quantity,
				product: product,
			};
			this.set({ items: [...currentItems, newItem] });
		}

		// Trigger custom event for cart updates
		this.trigger('cart.item.added', { product, quantity });
	}

	/**
	 * Update quantity of a product in the cart
	 */
	updateQuantity(productId: string, quantity: number): void {
		if (quantity <= 0) {
			this.removeProduct(productId);
			return;
		}

		const currentItems = this.items || [];
		const updatedItems = currentItems.map(item =>
			item.productId === productId ? { ...item, quantity } : item
		);
		this.set({ items: updatedItems });

		this.trigger('cart.item.updated', { productId, quantity });
	}

	/**
	 * Remove a product from the cart
	 */
	removeProduct(productId: string): void {
		const currentItems = this.items || [];
		const updatedItems = currentItems.filter(item => item.productId !== productId);
		this.set({ items: updatedItems });

		this.trigger('cart.item.removed', { productId });
	}

	/**
	 * Clear all items from the cart
	 */
	clear(): void {
		this.set({ items: [] });
		this.trigger('cart.cleared');
	}

	/**
	 * Get cart item by product ID
	 */
	getItem(productId: string): ICartItem | undefined {
		return this.items?.find(item => item.productId === productId);
	}

	/**
	 * Check if a product is in the cart
	 */
	hasProduct(productId: string): boolean {
		return this.items?.some(item => item.productId === productId) ?? false;
	}

	/**
	 * Get quantity of a product in the cart
	 */
	getQuantity(productId: string): number {
		const item = this.getItem(productId);
		return item?.quantity ?? 0;
	}
}
