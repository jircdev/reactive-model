import { lazy, ComponentType, LazyExoticComponent } from 'react';

/**
 * Metadata for each example in the testing project.
 */
export interface ExampleMetadata {
	/** Unique identifier */
	id: string;
	/** Display title */
	title: string;
	/** Short description */
	description: string;
	/** Route path */
	path: string;
	/** Emoji icon */
	icon: string;
	/** Lazy-loaded component */
	component: LazyExoticComponent<ComponentType>;
	/** Feature tags */
	tags: string[];
}

/**
 * Registry of all available examples.
 * Add new examples here to make them available in the navigation.
 */
export const examples: ExampleMetadata[] = [
	{
		id: 'products',
		title: 'Listado de Productos',
		description: 'Item, Collection con Categories y Tags. Demuestra lifecycle hooks, computed properties y relaciones entre entidades.',
		path: '/products',
		icon: '🛍️',
		component: lazy(() => import('./products')),
		tags: ['item', 'collection', 'hooks', 'computed', 'relations'],
	},
	// Future examples can be added here:
	// {
	//   id: 'basic',
	//   title: 'ReactiveModel Básico',
	//   description: 'Uso básico de ReactiveModel sin Item/Collection.',
	//   path: '/basic',
	//   icon: '📦',
	//   component: lazy(() => import('./basic')),
	//   tags: ['model', 'events'],
	// },
];
