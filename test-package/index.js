import { Collection } from '@beyond-js/reactive/entities/collection';
import { Item } from '@beyond-js/reactive/entities/item';

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
			{ id: '1', name: 'Laptop Dell XPS 13', price: 1299.99, category: 'Electronics', description: 'High-performance laptop for professionals' },
			{ id: '2', name: 'iPhone 15 Pro', price: 999.99, category: 'Electronics', description: 'Latest iPhone with advanced features' },
			{ id: '3', name: 'Sony WH-1000XM5', price: 399.99, category: 'Audio', description: 'Premium noise-cancelling headphones' },
			{ id: '4', name: 'MacBook Pro 16"', price: 2499.99, category: 'Electronics', description: 'Powerful laptop for creative professionals' },
			{ id: '5', name: 'Samsung 4K TV', price: 799.99, category: 'Electronics', description: '55-inch 4K Ultra HD Smart TV' },
			{ id: '6', name: 'AirPods Pro', price: 249.99, category: 'Audio', description: 'Wireless earbuds with active noise cancellation' },
			{ id: '7', name: 'Nintendo Switch', price: 299.99, category: 'Gaming', description: 'Hybrid gaming console' },
			{ id: '8', name: 'PlayStation 5', price: 499.99, category: 'Gaming', description: 'Next-generation gaming console' },
		];

		// Aplicar filtros simples si existen
		let filtered = allProducts;
		if (specs.where) {
			if (specs.where.category?.equals) {
				filtered = filtered.filter((p) => p.category === specs.where.category.equals);
			}
			if (specs.where.price?.lte) {
				filtered = filtered.filter((p) => p.price <= specs.where.price.lte);
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

// Función para mostrar productos en formato tabla
function displayProducts(products) {
	console.log('\n' + '='.repeat(100));
	console.log('LISTA DE PRODUCTOS'.padStart(55));
	console.log('='.repeat(100));
	console.log(
		`ID`.padEnd(5) +
			`Nombre`.padEnd(35) +
			`Precio`.padEnd(15) +
			`Categoría`.padEnd(20) +
			`Descripción`.padEnd(30),
	);
	console.log('-'.repeat(100));

	products.forEach((product) => {
		const id = product.id || 'N/A';
		const name = (product.name || 'N/A').substring(0, 33);
		const price = product.price ? `$${product.price.toFixed(2)}` : 'N/A';
		const category = (product.category || 'N/A').substring(0, 18);
		const description = (product.description || 'N/A').substring(0, 28);

		console.log(
			id.padEnd(5) + name.padEnd(35) + price.padEnd(15) + category.padEnd(20) + description.padEnd(30),
		);
	});

	console.log('='.repeat(100));
	console.log(`Total: ${products.length} productos\n`);
}

// Función principal
async function main() {
	console.log('🚀 Iniciando test de @beyond-js/reactive\n');

	try {
		// Crear colección
		const products = new Products();

		// Cargar todos los productos
		console.log('📦 Cargando productos...');
		const items = await products.load();
		console.log(`✅ ${items.length} productos cargados\n`);

		// Mostrar todos los productos
		displayProducts(items);

		// Filtrar por categoría
		console.log('\n🔍 Filtrando productos de categoría "Electronics"...');
		const electronics = await products.load({
			where: {
				category: { equals: 'Electronics' },
			},
		});
		console.log(`✅ ${electronics.length} productos encontrados\n`);
		displayProducts(electronics);

		// Filtrar por precio
		console.log('\n💰 Filtrando productos con precio <= $500...');
		const affordable = await products.load({
			where: {
				price: { lte: 500 },
			},
		});
		console.log(`✅ ${affordable.length} productos encontrados\n`);
		displayProducts(affordable);

		// Acceder a propiedades directamente
		console.log('\n📋 Accediendo a propiedades directamente:');
		console.log(`Primer producto: ${products.items[0].name}`);
		console.log(`Precio: $${products.items[0].price}`);
		console.log(`Categoría: ${products.items[0].category}`);

		// Usar getProperty para acceso dinámico
		console.log('\n🔧 Usando getProperty() para acceso dinámico:');
		const propName = 'name';
		const productName = products.items[0].getProperty(propName);
		console.log(`Nombre (dinámico): ${productName}`);

		console.log('\n✅ Test completado exitosamente!');
	} catch (error) {
		console.error('❌ Error:', error);
		process.exit(1);
	}
}

// Ejecutar
main();

