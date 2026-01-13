// Importar usando import maps (definidos en index.html)
import { Collection } from 'reactive/entities/collection';
import { Item } from 'reactive/entities/item';

// Definir interfaz para un Producto
class Product extends Item {
	constructor(specs = {}) {
		super({
			entity: 'products',
			properties: ['id', 'name', 'price', 'category', 'description'],
			...specs,
		});
	}
}

// Provider mock para productos
class ProductProvider {
	async list(specs = {}) {
		// Datos de ejemplo
		const allProducts = [
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

		// Aplicar filtros simples si existen
		let filtered = allProducts;
		if (specs.where) {
			if (specs.where.category?.equals) {
				filtered = filtered.filter(p => p.category === specs.where.category.equals);
			}
			if (specs.where.price?.lte) {
				filtered = filtered.filter(p => p.price <= specs.where.price.lte);
			}
		}

		// Aplicar límite
		const limit = specs.limit || 10;
		const items = filtered.slice(0, limit);

		return {
			items,
			total: filtered.length,
			next: items.length < filtered.length ? 'page2' : null,
		};
	}

	async deleteMany(ids) {
		return true;
	}
}

// Colección de productos
class Products extends Collection {
	constructor(specs = {}) {
		super({
			entity: 'products',
			item: Product,
			provider: ProductProvider,
			...specs,
		});
	}
}

// Estado global de la aplicación
let productsCollection = null;

// Inicializar la aplicación
async function init() {
	try {
		console.log('Inicializando aplicación...');
		productsCollection = new Products();
		window.productsCollection = productsCollection;
		console.log('Colección creada:', productsCollection);
		await loadAll();
	} catch (error) {
		console.error('Error en init:', error);
		showError(error);
	}
}

// Cargar todos los productos
async function loadAll() {
	try {
		showLoading();
		console.log('Cargando productos...');
		const items = await productsCollection.load();
		console.log('Productos cargados:', items);
		displayProducts(items);
		updateStats(items.length, productsCollection.getTotal());
	} catch (error) {
		console.error('Error al cargar productos:', error);
		showError(error);
	}
}

// Filtrar por categoría
async function filterByCategory(category) {
	try {
		showLoading();
		const items = await productsCollection.load({
			where: {
				category: { equals: category },
			},
		});
		displayProducts(items);
		updateStats(items.length, productsCollection.getTotal());
	} catch (error) {
		showError(error);
	}
}

// Filtrar por precio máximo
async function filterByPrice(maxPrice) {
	try {
		showLoading();
		const items = await productsCollection.load({
			where: {
				price: { lte: maxPrice },
			},
		});
		displayProducts(items);
		updateStats(items.length, productsCollection.getTotal());
	} catch (error) {
		showError(error);
	}
}

// Mostrar productos en el DOM
function displayProducts(items) {
	const container = document.getElementById('products-container');

	if (!items || items.length === 0) {
		container.innerHTML = '<div class="loading">No se encontraron productos</div>';
		return;
	}

	const html = items
		.map(product => {
			// Acceso directo a propiedades
			const id = product.id || 'N/A';
			const name = product.name || 'N/A';
			const price = product.price ? `$${product.price.toFixed(2)}` : 'N/A';
			const category = product.category || 'N/A';
			const description = product.description || 'N/A';

			return `
			<div class="product-card">
				<span class="category">${category}</span>
				<h3>${name}</h3>
				<div class="price">${price}</div>
				<p class="description">${description}</p>
			</div>
		`;
		})
		.join('');

	container.innerHTML = `<div class="products-grid">${html}</div>`;
}

// Actualizar estadísticas
function updateStats(filtered, total) {
	document.getElementById('filtered-count').textContent = filtered;
	document.getElementById('total-count').textContent = total;
}

// Mostrar estado de carga
function showLoading() {
	document.getElementById('products-container').innerHTML = '<div class="loading">Cargando productos...</div>';
}

// Mostrar error
function showError(error) {
	const container = document.getElementById('products-container');
	const errorMessage = error?.message || error?.toString() || 'Ocurrió un error desconocido';
	const errorStack = error?.stack
		? `<pre style="font-size: 0.8em; margin-top: 10px; overflow-x: auto;">${error.stack}</pre>`
		: '';

	container.innerHTML = `
		<div class="error">
			<h3>❌ Error</h3>
			<p><strong>${errorMessage}</strong></p>
			${errorStack}
			<p style="margin-top: 15px; font-size: 0.9em;">
				<strong>Ayuda:</strong> Abre la consola del navegador (F12) para ver más detalles del error.
			</p>
		</div>
	`;
}

// Funciones globales para los botones
window.loadAll = loadAll;
window.filterElectronics = () => filterByCategory('Electronics');
window.filterAudio = () => filterByCategory('Audio');
window.filterGaming = () => filterByCategory('Gaming');
window.filterAffordable = () => filterByPrice(500);

// Manejar errores no capturados
window.addEventListener('error', event => {
	console.error('Error global:', event.error);
	showError(event.error || new Error(event.message));
});

window.addEventListener('unhandledrejection', event => {
	console.error('Promise rechazada:', event.reason);
	showError(event.reason || new Error('Error al cargar la aplicación'));
});

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', () => {
		// Pequeño delay para asegurar que los import maps estén cargados
		setTimeout(init, 100);
	});
} else {
	// Pequeño delay para asegurar que los import maps estén cargados
	setTimeout(init, 100);
}
