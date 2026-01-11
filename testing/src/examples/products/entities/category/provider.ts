import type { ICategory } from './types';

/**
 * Mock data for categories
 */
const MOCK_CATEGORIES: ICategory[] = [
	{
		id: 'cat-1',
		name: 'Electrónica',
		slug: 'electronica',
		color: '#3498db',
		description: 'Dispositivos electrónicos y gadgets',
	},
	{
		id: 'cat-2',
		name: 'Audio',
		slug: 'audio',
		color: '#9b59b6',
		description: 'Equipos de sonido y auriculares',
	},
	{
		id: 'cat-3',
		name: 'Gaming',
		slug: 'gaming',
		color: '#e74c3c',
		description: 'Consolas y accesorios de gaming',
	},
	{
		id: 'cat-4',
		name: 'Accesorios',
		slug: 'accesorios',
		color: '#2ecc71',
		description: 'Accesorios y complementos',
	},
];

/**
 * Provider for Category entity
 */
export class CategoryProvider {
	#parent: unknown;

	constructor(parent: unknown) {
		this.#parent = parent;
	}

	async load(id?: string): Promise<ICategory> {
		await this.simulateDelay(200);
		const category = MOCK_CATEGORIES.find(c => c.id === id);
		if (!category) {
			throw new Error(`Category ${id} not found`);
		}
		return { ...category };
	}

	async list(): Promise<ICategory[]> {
		await this.simulateDelay(300);
		return MOCK_CATEGORIES.map(c => ({ ...c }));
	}

	private simulateDelay(ms: number): Promise<void> {
		return new Promise(resolve => setTimeout(resolve, ms));
	}
}
