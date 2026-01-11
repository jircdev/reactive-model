import { Item } from '@beyond-js/reactive/entities/item';
import { TagProvider } from './provider';
import type { ITag } from './types';

/**
 * Tag Item
 */
export class Tag extends Item<ITag, TagProvider> {
	declare id: string;
	declare name: string;
	declare color: string;

	constructor(specs: Partial<ITag> = {}) {
		super({
			entity: 'tags',
			provider: TagProvider,
			properties: ['id', 'name', 'color'],
			...specs,
		});
	}
}
