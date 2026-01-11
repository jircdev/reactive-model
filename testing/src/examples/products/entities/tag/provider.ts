import type { ITag } from './types';

/**
 * Mock data for tags
 */
const MOCK_TAGS: ITag[] = [
	{ id: 'tag-1', name: 'Nuevo', color: '#27ae60' },
	{ id: 'tag-2', name: 'Oferta', color: '#e74c3c' },
	{ id: 'tag-3', name: 'Popular', color: '#f39c12' },
	{ id: 'tag-4', name: 'Premium', color: '#9b59b6' },
	{ id: 'tag-5', name: 'Recomendado', color: '#3498db' },
	{ id: 'tag-6', name: 'Limitado', color: '#e67e22' },
	{ id: 'tag-7', name: 'Exclusivo', color: '#1abc9c' },
	{ id: 'tag-8', name: 'Bestseller', color: '#e91e63' },
];

/**
 * Provider for Tag entity
 */
export class TagProvider {
	#parent: unknown;

	constructor(parent: unknown) {
		this.#parent = parent;
	}

	async load(id?: string): Promise<ITag> {
		await this.simulateDelay(150);
		const tag = MOCK_TAGS.find(t => t.id === id);
		if (!tag) {
			throw new Error(`Tag ${id} not found`);
		}
		return { ...tag };
	}

	async list(): Promise<ITag[]> {
		await this.simulateDelay(200);
		return MOCK_TAGS.map(t => ({ ...t }));
	}

	private simulateDelay(ms: number): Promise<void> {
		return new Promise(resolve => setTimeout(resolve, ms));
	}
}
