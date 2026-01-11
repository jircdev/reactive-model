import type { Category } from '../entities/category';
import './CategoryFilter.css';

interface CategoryFilterProps {
	categories: Category[];
	selectedCategory: string | null;
	onSelect: (categoryId: string | null) => void;
}

export function CategoryFilter({ categories, selectedCategory, onSelect }: CategoryFilterProps) {
	return (
		<div className="category-filter">
			<h3 className="filter-title">Categorías</h3>
			<ul className="category-list">
				<li>
					<button
						className={`category-btn ${selectedCategory === null ? 'active' : ''}`}
						onClick={() => onSelect(null)}
					>
						<span className="category-dot" style={{ backgroundColor: '#888' }} />
						Todas
					</button>
				</li>
				{categories.map(category => (
					<li key={category.id}>
						<button
							className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
							onClick={() => onSelect(category.id)}
						>
							<span className="category-dot" style={{ backgroundColor: category.color }} />
							{category.name}
						</button>
					</li>
				))}
			</ul>
		</div>
	);
}
