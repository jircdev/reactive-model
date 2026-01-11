import type { IProduct } from './types';
import type { IItemProviderResponse } from '@beyond-js/reactive/entities/item';

/**
 * Mock data for products
 */
const MOCK_PRODUCTS: IProduct[] = [
	{
		id: 'prod-1',
		name: 'MacBook Pro 16"',
		price: 2499.99,
		description: 'Potente laptop para profesionales creativos con chip M3 Pro.',
		categoryId: 'cat-1',
		tagIds: ['tag-1', 'tag-4', 'tag-5'],
		stock: 15,
		imageUrl: 'https://picsum.photos/seed/macbook/400/300',
		createdAt: Date.now() - 86400000 * 30,
	},
	{
		id: 'prod-2',
		name: 'iPhone 15 Pro Max',
		price: 1199.99,
		description: 'El iPhone más avanzado con cámara de 48MP y Dynamic Island.',
		categoryId: 'cat-1',
		tagIds: ['tag-1', 'tag-3', 'tag-8'],
		stock: 42,
		imageUrl: 'https://picsum.photos/seed/iphone/400/300',
		createdAt: Date.now() - 86400000 * 15,
	},
	{
		id: 'prod-3',
		name: 'Sony WH-1000XM5',
		price: 399.99,
		description: 'Auriculares premium con cancelación de ruido líder en la industria.',
		categoryId: 'cat-2',
		tagIds: ['tag-3', 'tag-4', 'tag-5'],
		stock: 28,
		imageUrl: 'https://picsum.photos/seed/sony/400/300',
		createdAt: Date.now() - 86400000 * 60,
	},
	{
		id: 'prod-4',
		name: 'PlayStation 5',
		price: 499.99,
		description: 'Consola de próxima generación con SSD ultrarrápido.',
		categoryId: 'cat-3',
		tagIds: ['tag-3', 'tag-8'],
		stock: 5,
		imageUrl: 'https://picsum.photos/seed/ps5/400/300',
		createdAt: Date.now() - 86400000 * 90,
	},
	{
		id: 'prod-5',
		name: 'Nintendo Switch OLED',
		price: 349.99,
		description: 'Consola híbrida con pantalla OLED vibrante de 7 pulgadas.',
		categoryId: 'cat-3',
		tagIds: ['tag-3', 'tag-5'],
		stock: 18,
		imageUrl: 'https://picsum.photos/seed/switch/400/300',
		createdAt: Date.now() - 86400000 * 120,
	},
	{
		id: 'prod-6',
		name: 'AirPods Pro 2',
		price: 249.99,
		description: 'Auriculares inalámbricos con cancelación activa de ruido.',
		categoryId: 'cat-2',
		tagIds: ['tag-1', 'tag-3', 'tag-5'],
		stock: 67,
		imageUrl: 'https://picsum.photos/seed/airpods/400/300',
		createdAt: Date.now() - 86400000 * 45,
	},
	{
		id: 'prod-7',
		name: 'Samsung Galaxy S24 Ultra',
		price: 1299.99,
		description: 'Smartphone con S Pen integrado y cámara de 200MP.',
		categoryId: 'cat-1',
		tagIds: ['tag-1', 'tag-4', 'tag-7'],
		stock: 23,
		imageUrl: 'https://picsum.photos/seed/samsung/400/300',
		createdAt: Date.now() - 86400000 * 7,
	},
	{
		id: 'prod-8',
		name: 'Xbox Series X',
		price: 499.99,
		description: 'La consola Xbox más potente con 12 teraflops de potencia.',
		categoryId: 'cat-3',
		tagIds: ['tag-3', 'tag-6'],
		stock: 3,
		imageUrl: 'https://picsum.photos/seed/xbox/400/300',
		createdAt: Date.now() - 86400000 * 100,
	},
	{
		id: 'prod-9',
		name: 'Bose QuietComfort Ultra',
		price: 429.99,
		description: 'Auriculares con audio espacial inmersivo y ANC adaptativo.',
		categoryId: 'cat-2',
		tagIds: ['tag-1', 'tag-4', 'tag-7'],
		stock: 12,
		imageUrl: 'https://picsum.photos/seed/bose/400/300',
		createdAt: Date.now() - 86400000 * 20,
	},
	{
		id: 'prod-10',
		name: 'Apple Watch Ultra 2',
		price: 799.99,
		description: 'El reloj más resistente y capaz de Apple para aventureros.',
		categoryId: 'cat-4',
		tagIds: ['tag-1', 'tag-4', 'tag-6'],
		stock: 8,
		imageUrl: 'https://picsum.photos/seed/watch/400/300',
		createdAt: Date.now() - 86400000 * 10,
	},
];

// Simulated database
let productsDB = [...MOCK_PRODUCTS];

/**
 * Provider for Product entity
 */
export class ProductProvider {
	#parent: unknown;

	constructor(parent: unknown) {
		this.#parent = parent;
	}

	async load(id?: string): Promise<IProduct> {
		await this.simulateDelay(300);
		const product = productsDB.find(p => p.id === id);
		if (!product) {
			throw new Error(`Product ${id} not found`);
		}
		return { ...product };
	}

	async list(specs?: { categoryId?: string; tagIds?: string[] }): Promise<IProduct[]> {
		await this.simulateDelay(500);
		let results = [...productsDB];

		if (specs?.categoryId) {
			results = results.filter(p => p.categoryId === specs.categoryId);
		}

		if (specs?.tagIds && specs.tagIds.length > 0) {
			results = results.filter(p => specs.tagIds!.some(tagId => p.tagIds.includes(tagId)));
		}

		return results.map(p => ({ ...p }));
	}

	async publish(data: Partial<IProduct>): Promise<IItemProviderResponse<IProduct>> {
		await this.simulateDelay(400);

		if (data.id) {
			// Update existing
			const index = productsDB.findIndex(p => p.id === data.id);
			if (index !== -1) {
				productsDB[index] = { ...productsDB[index], ...data, updatedAt: Date.now() };
				return { status: 200, data: { ...productsDB[index] } };
			}
		}

		// Create new
		const newProduct: IProduct = {
			id: `prod-${Date.now()}`,
			name: data.name || 'New Product',
			price: data.price || 0,
			description: data.description || '',
			categoryId: data.categoryId || 'cat-1',
			tagIds: data.tagIds || [],
			stock: data.stock || 0,
			createdAt: Date.now(),
			...data,
		};
		productsDB.push(newProduct);
		return { status: 201, data: { ...newProduct } };
	}

	async delete(id: string): Promise<boolean> {
		await this.simulateDelay(300);
		const index = productsDB.findIndex(p => p.id === id);
		if (index !== -1) {
			productsDB.splice(index, 1);
			return true;
		}
		return false;
	}

	private simulateDelay(ms: number): Promise<void> {
		return new Promise(resolve => setTimeout(resolve, ms));
	}
}
