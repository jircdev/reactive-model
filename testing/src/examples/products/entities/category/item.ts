import { Item } from '@beyond-js/reactive/entities/item';
import { CategoryProvider } from './provider';
import type { ICategory } from './types';

/**
 * Category Item
 */
export class Category extends Item<ICategory, CategoryProvider> {
	declare id: string;
	declare name: string;
	declare slug: string;
	declare color: string;
	declare description: string;

	constructor(specs: Partial<ICategory> = {}) {
		super({
			entity: 'categories',
			provider: CategoryProvider,
			properties: ['id', 'name', 'slug', 'color', 'description'],
			...specs,
		});
	}
}
