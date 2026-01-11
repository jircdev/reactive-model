/**
 * Product interface
 */
export interface IProduct {
	id: string;
	name: string;
	price: number;
	description: string;
	categoryId: string;
	tagIds: string[];
	stock: number;
	imageUrl?: string;
	createdAt: number;
	updatedAt?: number;
	// Computed properties
	isLowStock?: boolean;
	formattedPrice?: string;
}
