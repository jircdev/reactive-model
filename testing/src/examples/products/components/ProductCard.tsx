import { useState } from 'react';
import type { Product } from '../entities/product';
import type { Category } from '../entities/category';
import type { Tag } from '../entities/tag';
import './ProductCard.css';

interface ProductCardProps {
	product: Product;
	category?: Category;
	tags: Tag[];
	onStockChange?: (product: Product, delta: number) => void;
	onAddToCart?: (product: Product) => void;
	cartQuantity?: number;
}

export function ProductCard({
	product,
	category,
	tags,
	onStockChange,
	onAddToCart,
	cartQuantity = 0,
}: ProductCardProps) {
	const [updating, setUpdating] = useState(false);

	const isLowStock = (product as unknown as { isLowStock: boolean }).isLowStock;
	const formattedPrice = (product as unknown as { formattedPrice: string }).formattedPrice;

	const handleStockChange = async (delta: number) => {
		if (onStockChange) {
			setUpdating(true);
			try {
				onStockChange(product, delta);
			} finally {
				setUpdating(false);
			}
		}
	};

	const handleAddToCart = () => {
		if (onAddToCart) {
			onAddToCart(product);
		}
	};

	return (
		<div className={`product-card ${isLowStock ? 'low-stock' : ''}`}>
			{product.imageUrl && (
				<div className="product-image">
					<img src={product.imageUrl} alt={product.name} loading="lazy" />
					{isLowStock && <span className="stock-badge">⚠️ Stock bajo</span>}
				</div>
			)}

			<div className="product-content">
				<div className="product-header">
					<h3 className="product-name">{product.name}</h3>
					<span className="product-price">{formattedPrice}</span>
				</div>

				{category && (
					<span className="product-category" style={{ backgroundColor: category.color }}>
						{category.name}
					</span>
				)}

				<p className="product-description">{product.description}</p>

				<div className="product-tags">
					{tags.map(tag => (
						<span key={tag.id} className="product-tag" style={{ backgroundColor: tag.color }}>
							{tag.name}
						</span>
					))}
				</div>

				<div className="product-footer">
					<div className="stock-control">
						<span className="stock-label">Stock: {product.stock}</span>
						{onStockChange && (
							<div className="stock-buttons">
								<button
									onClick={() => handleStockChange(-1)}
									disabled={updating || product.stock <= 0}
									className="stock-btn decrease"
								>
									-
								</button>
								<button
									onClick={() => handleStockChange(1)}
									disabled={updating}
									className="stock-btn increase"
								>
									+
								</button>
							</div>
						)}
					</div>
					{onAddToCart && (
						<button
							onClick={handleAddToCart}
							disabled={product.stock <= 0}
							className="add-to-cart-btn"
						>
							{cartQuantity > 0 ? (
								<>
									🛒 {cartQuantity} en carrito
								</>
							) : (
								<>🛒 Agregar</>
							)}
						</button>
					)}
				</div>
			</div>
		</div>
	);
}
