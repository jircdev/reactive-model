import { useState } from 'react';
import { useProducts } from './hooks/useProducts';
import { useCart } from './hooks/useCart';
import { ProductCard, CategoryFilter, TagFilter, SearchBar, CartSidebar } from './components';
import './styles.css';

/**
 * Products Example Page
 *
 * Demonstrates:
 * - Item and Collection with reactive state
 * - Lifecycle hooks (beforeLoad, afterLoad, beforePublish)
 * - Computed properties (isLowStock, formattedPrice)
 * - Relations between entities (Product -> Category, Product -> Tags)
 * - Event-driven updates
 * - ReactiveModel for client-side state (Cart)
 * - Reactive updates: memory changes → events → UI updates
 */
export default function ProductsPage() {
	const {
		categories,
		tags,
		loading,
		error,
		selectedCategory,
		selectedTags,
		searchQuery,
		setSelectedCategory,
		toggleTag,
		setSearchQuery,
		filteredProducts,
	} = useProducts();

	const { addProduct, itemCount, getQuantity } = useCart();
	const [isCartOpen, setIsCartOpen] = useState(false);

	const handleStockChange = (product: (typeof filteredProducts)[0], delta: number) => {
		product.updateStock(delta);
	};

	const handleAddToCart = (product: (typeof filteredProducts)[0]) => {
		addProduct(product, 1);
		// Optional: show feedback or open cart
		// setIsCartOpen(true);
	};

	// Get category and tags for a product
	const getCategory = (categoryId: string) => categories.find(c => c.id === categoryId);
	const getProductTags = (tagIds: string[]) => tags.filter(t => tagIds.includes(t.id));

	if (loading) {
		return (
			<div className="products-page">
				<div className="loading">Cargando productos...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="products-page">
				<div className="error">
					<h2>Error</h2>
					<p>{error}</p>
				</div>
			</div>
		);
	}

	const lowStockCount = filteredProducts.filter(
		p => (p as unknown as { isLowStock: boolean }).isLowStock
	).length;

	return (
		<div className="products-page">
			<header className="page-header">
				<div className="header-content">
					<h1>🛍️ Listado de Productos</h1>
					<p className="page-description">
						Ejemplo de Item y Collection con lifecycle hooks, computed properties y relaciones
						entre entidades. Incluye carrito reactivo que se actualiza automáticamente.
					</p>
				</div>
				<div className="header-stats">
					<div className="stat">
						<span className="stat-value">{filteredProducts.length}</span>
						<span className="stat-label">Productos</span>
					</div>
					<div className="stat">
						<span className="stat-value">{categories.length}</span>
						<span className="stat-label">Categorías</span>
					</div>
					{lowStockCount > 0 && (
						<div className="stat warning">
							<span className="stat-value">{lowStockCount}</span>
							<span className="stat-label">Stock bajo</span>
						</div>
					)}
					<button className="cart-button" onClick={() => setIsCartOpen(true)}>
						🛒 Carrito
						{itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
					</button>
				</div>
			</header>

			<div className="page-content">
				<aside className="sidebar-filters">
					<SearchBar value={searchQuery} onChange={setSearchQuery} />
					<CategoryFilter
						categories={categories}
						selectedCategory={selectedCategory}
						onSelect={setSelectedCategory}
					/>
					<TagFilter tags={tags} selectedTags={selectedTags} onToggle={toggleTag} />

					<div className="features-info">
						<h3>🔧 Features Demostradas</h3>
						<ul>
							<li>
								<strong>Items & Collections</strong> - Gestión reactiva de entidades
							</li>
							<li>
								<strong>Lifecycle Hooks</strong> - beforeLoad, afterLoad, beforePublish
							</li>
							<li>
								<strong>Computed Properties</strong> - isLowStock, formattedPrice
							</li>
							<li>
								<strong>Relaciones</strong> - Product → Category (1:1), Tags (1:N)
							</li>
							<li>
								<strong>Change Tracking</strong> - Modificar stock actualiza UI
							</li>
							<li>
								<strong>Reactive Cart</strong> - Carrito con ReactiveModel que se actualiza
								automáticamente
							</li>
							<li>
								<strong>Event-Driven UI</strong> - Cambios en memoria → eventos → UI reactiva
							</li>
						</ul>
						<p className="info-note">
							Abre la consola para ver los logs de lifecycle hooks. Agrega productos al carrito
							y observa cómo se actualiza automáticamente.
						</p>
					</div>
				</aside>

				<main className="products-main">
					{filteredProducts.length === 0 ? (
						<div className="empty-state">
							<span className="empty-icon">🔍</span>
							<h3>No se encontraron productos</h3>
							<p>Intenta ajustar los filtros de búsqueda.</p>
						</div>
					) : (
						<div className="products-grid">
							{filteredProducts.map(product => (
								<ProductCard
									key={product.id}
									product={product}
									category={getCategory(product.categoryId)}
									tags={getProductTags(product.tagIds || [])}
									onStockChange={handleStockChange}
									onAddToCart={handleAddToCart}
									cartQuantity={getQuantity(product.id)}
								/>
							))}
						</div>
					)}
				</main>
			</div>

			<CartSidebar
				products={filteredProducts}
				isOpen={isCartOpen}
				onClose={() => setIsCartOpen(false)}
			/>
		</div>
	);
}
