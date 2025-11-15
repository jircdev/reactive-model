import { useState, useEffect } from 'react';
import { Collection } from '@beyond-js/reactive/entities/collection';
import { Item } from '@beyond-js/reactive/entities/item';
import './App.css';

// Definir la interfaz del producto
interface IProduct {
	id: string;
	name: string;
	price: number;
	category: string;
	description: string;
}

// Provider simple para productos
class ProductProvider {
	async load(id: string): Promise<IProduct> {
		// Simular carga desde API
		await new Promise(resolve => setTimeout(resolve, 500));
		const products = this.getMockProducts();
		const product = products.find(p => p.id === id);
		if (!product) throw new Error(`Product ${id} not found`);
		return product;
	}

	async list(): Promise<IProduct[]> {
		// Simular carga desde API
		await new Promise(resolve => setTimeout(resolve, 800));
		return this.getMockProducts();
	}

	async save(data: IProduct): Promise<IProduct> {
		// Simular guardado
		await new Promise(resolve => setTimeout(resolve, 300));
		return { ...data };
	}

	async delete(id: string): Promise<boolean> {
		// Simular eliminación
		await new Promise(resolve => setTimeout(resolve, 300));
		return true;
	}

	private getMockProducts(): IProduct[] {
		return [
			{
				id: '1',
				name: 'Laptop Dell XPS 13',
				price: 1299.99,
				category: 'Electronics',
				description: 'High-performance laptop for professionals',
			},
			{
				id: '2',
				name: 'iPhone 15 Pro',
				price: 999.99,
				category: 'Electronics',
				description: 'Latest iPhone with advanced features',
			},
			{
				id: '3',
				name: 'Sony WH-1000XM5',
				price: 399.99,
				category: 'Audio',
				description: 'Premium noise-cancelling headphones',
			},
			{
				id: '4',
				name: 'MacBook Pro 16"',
				price: 2499.99,
				category: 'Electronics',
				description: 'Powerful laptop for creative professionals',
			},
			{
				id: '5',
				name: 'Samsung 4K TV',
				price: 799.99,
				category: 'Electronics',
				description: '55-inch 4K Ultra HD Smart TV',
			},
			{
				id: '6',
				name: 'AirPods Pro',
				price: 249.99,
				category: 'Audio',
				description: 'Wireless earbuds with active noise cancellation',
			},
			{
				id: '7',
				name: 'Nintendo Switch',
				price: 299.99,
				category: 'Gaming',
				description: 'Hybrid gaming console',
			},
			{
				id: '8',
				name: 'PlayStation 5',
				price: 499.99,
				category: 'Gaming',
				description: 'Next-generation gaming console',
			},
		];
	}
}

// Clase Product que extiende Item
class Product extends Item<IProduct, ProductProvider> {
	constructor(data?: Partial<IProduct>) {
		super({
			entity: 'products',
			provider: ProductProvider,
			properties: ['id', 'name', 'price', 'category', 'description'],
			...data,
		});
	}
}

// Clase Products que extiende Collection
class Products extends Collection<Product, ProductProvider> {
	constructor() {
		super({
			entity: 'products',
			provider: ProductProvider,
			item: Product,
		});
	}
}

function App() {
	const [products, setProducts] = useState<Products | null>(null);
	const [loading, setLoading] = useState(true);
	const [selectedCategory, setSelectedCategory] = useState<string>('all');
	const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

	useEffect(() => {
		const productsCollection = new Products();

		// Función handler para cambios
		const handleChange = () => {
			setFilteredProducts([...productsCollection.items]);
		};

		// Escuchar cambios en la colección
		productsCollection.on('change', handleChange);

		// Cargar productos
		productsCollection
			.load()
			.then(() => {
				setProducts(productsCollection);
				setFilteredProducts([...productsCollection.items]);
				setLoading(false);
			})
			.catch(error => {
				console.error('Error loading products:', error);
				setLoading(false);
			});

		return () => {
			// Pasar el listener específico para removerlo correctamente
			productsCollection.off('change', handleChange);
		};
	}, []);

	useEffect(() => {
		if (!products) return;

		if (selectedCategory === 'all') {
			setFilteredProducts([...products.items]);
		} else {
			const filtered = products.items.filter(p => p.category === selectedCategory);
			setFilteredProducts(filtered);
		}
	}, [selectedCategory, products]);

	const categories = products ? Array.from(new Set(products.items.map(p => p.category))).sort() : [];

	if (loading) {
		return (
			<div className='app'>
				<div className='loading'>Cargando productos...</div>
			</div>
		);
	}

	return (
		<div className='app'>
			<header className='header'>
				<h1>@beyond-js/reactive - Testing</h1>
				<p className='subtitle'>Ejemplo de uso con React + Vite</p>
			</header>

			<div className='controls'>
				<div className='filter-group'>
					<label htmlFor='category'>Filtrar por categoría:</label>
					<select id='category' value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
						<option value='all'>Todas</option>
						{categories.map(cat => (
							<option key={cat} value={cat}>
								{cat}
							</option>
						))}
					</select>
				</div>
				<div className='stats'>
					<span>
						Total: <strong>{filteredProducts.length}</strong> productos
					</span>
				</div>
			</div>

			<div className='products-grid'>
				{filteredProducts.map(product => (
					<div key={product.id} className='product-card'>
						<div className='product-header'>
							<h3>{product.name}</h3>
							<span className='price'>${product.price.toFixed(2)}</span>
						</div>
						<div className='product-body'>
							<span className='category'>{product.category}</span>
							<p className='description'>{product.description}</p>
						</div>
					</div>
				))}
			</div>

			{filteredProducts.length === 0 && (
				<div className='empty-state'>
					<p>No se encontraron productos en esta categoría.</p>
				</div>
			)}
		</div>
	);
}

export default App;
