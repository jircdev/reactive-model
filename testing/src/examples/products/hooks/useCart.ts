import { useState, useEffect, useCallback } from 'react';
import { Cart } from '../entities/cart';
import type { ICartItem } from '../entities/cart/types';

interface UseCartResult {
	cart: Cart;
	items: ICartItem[];
	total: number;
	itemCount: number;
	addProduct: (product: Parameters<Cart['addProduct']>[0], quantity?: number) => void;
	updateQuantity: (productId: string, quantity: number) => void;
	removeProduct: (productId: string) => void;
	clear: () => void;
	getQuantity: (productId: string) => number;
	hasProduct: (productId: string) => boolean;
}

/**
 * Custom hook for managing cart with reactive model
 *
 * Demonstrates:
 * - ReactiveModel for client-side state
 * - Event listeners for automatic UI updates
 * - Computed properties (total, itemCount)
 */
export function useCart(): UseCartResult {
	// Create cart instance (singleton pattern - same instance across renders)
	const [cart] = useState(() => new Cart());

	// State for reactive updates
	const [items, setItems] = useState<ICartItem[]>(cart.items || []);
	const [total, setTotal] = useState<number>(0);
	const [itemCount, setItemCount] = useState<number>(0);

	// Setup event listeners for reactive updates
	useEffect(() => {
		// Handler for any cart change
		const handleCartChange = () => {
			// Update state from cart model - this triggers React re-render
			setItems([...cart.items]);
			setTotal((cart as unknown as { total: number }).total ?? 0);
			setItemCount((cart as unknown as { itemCount: number }).itemCount ?? 0);
		};

		// Listen to change events
		cart.on('change', handleCartChange);
		cart.on('cart.item.added', handleCartChange);
		cart.on('cart.item.updated', handleCartChange);
		cart.on('cart.item.removed', handleCartChange);
		cart.on('cart.cleared', handleCartChange);

		// Initial state
		handleCartChange();

		// Cleanup
		return () => {
			cart.off('change', handleCartChange);
			cart.off('cart.item.added', handleCartChange);
			cart.off('cart.item.updated', handleCartChange);
			cart.off('cart.item.removed', handleCartChange);
			cart.off('cart.cleared', handleCartChange);
		};
	}, [cart]);

	// Wrapper methods
	const addProduct = useCallback(
		(product: Parameters<Cart['addProduct']>[0], quantity?: number) => {
			cart.addProduct(product, quantity);
		},
		[cart]
	);

	const updateQuantity = useCallback(
		(productId: string, quantity: number) => {
			cart.updateQuantity(productId, quantity);
		},
		[cart]
	);

	const removeProduct = useCallback(
		(productId: string) => {
			cart.removeProduct(productId);
		},
		[cart]
	);

	const clear = useCallback(() => {
		cart.clear();
	}, [cart]);

	const getQuantity = useCallback(
		(productId: string) => {
			return cart.getQuantity(productId);
		},
		[cart]
	);

	const hasProduct = useCallback(
		(productId: string) => {
			return cart.hasProduct(productId);
		},
		[cart]
	);

	return {
		cart,
		items,
		total,
		itemCount,
		addProduct,
		updateQuantity,
		removeProduct,
		clear,
		getQuantity,
		hasProduct,
	};
}
