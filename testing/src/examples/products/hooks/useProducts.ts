import { useState, useEffect, useCallback } from 'react';
import { Products, Product } from '../entities/product';
import { Categories, Category } from '../entities/category';
import { Tags, Tag } from '../entities/tag';

interface UseProductsResult {
	products: Product[];
	categories: Category[];
	tags: Tag[];
	loading: boolean;
	error: string | null;
	selectedCategory: string | null;
	selectedTags: string[];
	searchQuery: string;
	setSelectedCategory: (categoryId: string | null) => void;
	toggleTag: (tagId: string) => void;
	setSearchQuery: (query: string) => void;
	filteredProducts: Product[];
	refresh: () => Promise<void>;
}

/**
 * Custom hook for managing products with reactive collections
 */
export function useProducts(): UseProductsResult {
	const [productsCollection] = useState(() => new Products());
	const [categoriesCollection] = useState(() => new Categories());
	const [tagsCollection] = useState(() => new Tags());

	const [products, setProducts] = useState<Product[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [tags, setTags] = useState<Tag[]>([]);

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const [searchQuery, setSearchQuery] = useState('');

	// Load all data
	const loadData = useCallback(async () => {
		setLoading(true);
		setError(null);

		try {
			await Promise.all([productsCollection.load(), categoriesCollection.load(), tagsCollection.load()]);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Error loading data');
		} finally {
			setLoading(false);
		}
	}, [productsCollection, categoriesCollection, tagsCollection]);

	// Setup listeners
	useEffect(() => {
		const handleProductsChange = () => {
			setProducts([...productsCollection.items]);
		};

		const handleCategoriesChange = () => {
			setCategories([...categoriesCollection.items]);
		};

		const handleTagsChange = () => {
			setTags([...tagsCollection.items]);
		};

		productsCollection.on('change', handleProductsChange);
		categoriesCollection.on('change', handleCategoriesChange);
		tagsCollection.on('change', handleTagsChange);

		// Initial load
		loadData();

		return () => {
			productsCollection.off('change', handleProductsChange);
			categoriesCollection.off('change', handleCategoriesChange);
			tagsCollection.off('change', handleTagsChange);
		};
	}, [productsCollection, categoriesCollection, tagsCollection, loadData]);

	// Toggle tag selection
	const toggleTag = useCallback((tagId: string) => {
		setSelectedTags(prev => (prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]));
	}, []);

	// Filter products
	const filteredProducts = products.filter(product => {
		// Category filter
		if (selectedCategory && product.categoryId !== selectedCategory) {
			return false;
		}

		// Tags filter
		if (selectedTags.length > 0 && !selectedTags.some(tagId => product.hasTag(tagId))) {
			return false;
		}

		// Search filter
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			if (
				!product.name.toLowerCase().includes(query) &&
				!product.description.toLowerCase().includes(query)
			) {
				return false;
			}
		}

		return true;
	});

	return {
		products,
		categories,
		tags,
		loading,
		error,
		selectedCategory,
		selectedTags,
		searchQuery,
		setSelectedCategory,
		toggleTag,
		setSearchQuery,
		filteredProducts,
		refresh: loadData,
	};
}
