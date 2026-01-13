import { Collection } from 'reactive/entities/collection';
import { Category } from './item';
import { CategoryProvider } from './provider';

/**
 * Categories Collection
 */
export class Categories extends Collection<Category, CategoryProvider> {
	constructor() {
		super({
			entity: 'categories',
			provider: CategoryProvider,
			item: Category,
		});
	}

	/**
	 * Get category by slug
	 */
	getBySlug(slug: string): Category | undefined {
		return this.items.find(cat => cat.slug === slug);
	}
}
