import { Collection } from '@beyond-js/reactive/entities/collection';
import { Tag } from './item';
import { TagProvider } from './provider';

/**
 * Tags Collection
 */
export class Tags extends Collection<Tag, TagProvider> {
	constructor() {
		super({
			entity: 'tags',
			provider: TagProvider,
			item: Tag,
		});
	}

	/**
	 * Get tags by IDs
	 */
	getByIds(ids: string[]): Tag[] {
		return this.items.filter(tag => ids.includes(tag.id));
	}
}
