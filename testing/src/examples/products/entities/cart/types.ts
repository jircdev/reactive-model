import type { Product } from '../product';

/**
 * Cart Item interface
 * Represents a product in the cart with its quantity
 */
export interface ICartItem {
	productId: string;
	quantity: number;
	// Reference to the product (not serialized, computed)
	product?: Product;
}

/**
 * Cart interface
 */
export interface ICart {
	items: ICartItem[];
	// Computed properties
	total?: number;
	itemCount?: number;
}
