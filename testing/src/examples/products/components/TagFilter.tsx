import type { Tag } from '../entities/tag';
import './TagFilter.css';

interface TagFilterProps {
	tags: Tag[];
	selectedTags: string[];
	onToggle: (tagId: string) => void;
}

export function TagFilter({ tags, selectedTags, onToggle }: TagFilterProps) {
	return (
		<div className="tag-filter">
			<h3 className="filter-title">Etiquetas</h3>
			<div className="tag-chips">
				{tags.map(tag => (
					<button
						key={tag.id}
						className={`tag-chip ${selectedTags.includes(tag.id) ? 'active' : ''}`}
						onClick={() => onToggle(tag.id)}
						style={
							selectedTags.includes(tag.id)
								? { backgroundColor: tag.color, borderColor: tag.color }
								: { borderColor: tag.color, color: tag.color }
						}
					>
						{tag.name}
					</button>
				))}
			</div>
			{selectedTags.length > 0 && (
				<button className="clear-tags" onClick={() => selectedTags.forEach(onToggle)}>
					Limpiar filtros
				</button>
			)}
		</div>
	);
}
