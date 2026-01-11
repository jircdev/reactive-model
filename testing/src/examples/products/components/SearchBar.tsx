import './SearchBar.css';

interface SearchBarProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = 'Buscar productos...' }: SearchBarProps) {
	return (
		<div className="search-bar">
			<span className="search-icon">🔍</span>
			<input
				type="text"
				value={value}
				onChange={e => onChange(e.target.value)}
				placeholder={placeholder}
				className="search-input"
			/>
			{value && (
				<button className="search-clear" onClick={() => onChange('')}>
					✕
				</button>
			)}
		</div>
	);
}
