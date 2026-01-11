import { Link } from 'react-router-dom';
import { examples } from '@/examples';
import './IndexPage.css';

export function IndexPage() {
	return (
		<div className="index-page">
			<header className="index-header">
				<h1>@beyond-js/reactive</h1>
				<p className="subtitle">
					Librería reactiva para gestión de datos con soporte para Items, Collections, 
					lifecycle hooks, computed properties y sistema de plugins.
				</p>
				<div className="badges">
					<span className="badge">v2.3.0</span>
					<span className="badge">TypeScript</span>
					<span className="badge">React Compatible</span>
				</div>
			</header>

			<section className="examples-section">
				<h2>Ejemplos Disponibles</h2>
				<div className="examples-grid">
					{examples.map(example => (
						<Link key={example.id} to={example.path} className="example-card">
							<div className="example-icon">{example.icon}</div>
							<div className="example-content">
								<h3>{example.title}</h3>
								<p>{example.description}</p>
								<div className="example-tags">
									{example.tags.map(tag => (
										<span key={tag} className="tag">
											{tag}
										</span>
									))}
								</div>
							</div>
						</Link>
					))}
				</div>
			</section>

			<section className="features-section">
				<h2>Características Principales</h2>
				<div className="features-grid">
					<div className="feature">
						<h3>🎯 Items & Collections</h3>
						<p>Gestiona entidades individuales y colecciones con sincronización automática.</p>
					</div>
					<div className="feature">
						<h3>📡 Sistema de Eventos</h3>
						<p>Eventos reactivos para cada propiedad y cambios globales.</p>
					</div>
					<div className="feature">
						<h3>🪝 Lifecycle Hooks</h3>
						<p>Intercepta operaciones CRUD con hooks personalizables.</p>
					</div>
					<div className="feature">
						<h3>🧮 Computed Properties</h3>
						<p>Propiedades derivadas con cache y recálculo automático.</p>
					</div>
					<div className="feature">
						<h3>🔌 Plugin System</h3>
						<p>Extiende funcionalidad con plugins para cache, persistencia, etc.</p>
					</div>
					<div className="feature">
						<h3>✅ Validación Zod</h3>
						<p>Integración nativa con Zod para validación de datos.</p>
					</div>
				</div>
			</section>
		</div>
	);
}
