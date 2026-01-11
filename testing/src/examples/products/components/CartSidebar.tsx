import { useCart } from '../hooks/useCart';
import type { Product } from '../entities/product';
import './CartSidebar.css';

interface CartSidebarProps {
	products: Product[];
	isOpen: boolean;
	onClose: () => void;
}

/**
 * Cart Sidebar Component
 *
 * Demonstrates:
 * - Reactive updates from Cart model
 * - Event-driven UI updates
 * - Computed properties (total, itemCount)
 */
export function CartSidebar({ products, isOpen, onClose }: CartSidebarProps) {
	const { items, total, itemCount, updateQuantity, removeProduct, clear } = useCart();

	// Get product details for each cart item
	const getProduct = (productId: string): Product | undefined => {
		return products.find(p => p.id === productId);
	};

	// Format price
	const formatPrice = (price: number): string => {
		return new Intl.NumberFormat('es-ES', {
			style: 'currency',
			currency: 'USD',
		}).format(price);
	};

	if (!isOpen) return null;

	return (
		<div className="cart-sidebar-overlay" onClick={onClose}>
			<div className="cart-sidebar" onClick={e => e.stopPropagation()}>
				<div className="cart-header">
					<h2>🛒 Carrito de Compras</h2>
					<button className="cart-close-btn" onClick={onClose}>
						✕
					</button>
				</div>

				<div className="cart-content">
					{itemCount === 0 ? (
						<div className="cart-empty">
							<span className="empty-icon">🛒</span>
							<p>Tu carrito está vacío</p>
						</div>
					) : (
						<>
							<div className="cart-items">
								{items.map(item => {
									const product = getProduct(item.productId);
									if (!product) return null;

									return (
										<div key={item.productId} className="cart-item">
											<div className="cart-item-info">
												<h4>{product.name}</h4>
												<p className="cart-item-price">{formatPrice(product.price)}</p>
											</div>
											<div className="cart-item-controls">
												<div className="quantity-control">
													<button
														onClick={() => updateQuantity(item.productId, item.quantity - 1)}
														className="qty-btn decrease"
													>
														-
													</button>
													<span className="qty-value">{item.quantity}</span>
													<button
														onClick={() => updateQuantity(item.productId, item.quantity + 1)}
														className="qty-btn increase"
														disabled={product.stock <= item.quantity}
													>
														+
													</button>
												</div>
												<button
													onClick={() => removeProduct(item.productId)}
													className="remove-btn"
												>
													🗑️
												</button>
											</div>
											<div className="cart-item-subtotal">
												Subtotal: {formatPrice(product.price * item.quantity)}
											</div>
										</div>
									);
								})}
							</div>

							<div className="cart-footer">
								<div className="cart-total">
									<span className="total-label">Total:</span>
									<span className="total-value">{formatPrice(total)}</span>
								</div>
								<div className="cart-actions">
									<button onClick={clear} className="clear-btn">
										Limpiar carrito
									</button>
									<button className="checkout-btn">Finalizar compra</button>
								</div>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
