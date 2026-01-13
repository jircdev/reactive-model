import { NavLink, Outlet } from 'react-router-dom';
import { examples } from '@/examples';
import './Layout.css';

export function Layout() {
	return (
		<div className="layout">
			<aside className="sidebar">
				<div className="sidebar-header">
					<h1>reactive</h1>
					<span className="version">v2.3.0</span>
				</div>
				<nav className="nav">
					<NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} end>
						📋 Inicio
					</NavLink>
					<div className="nav-section">
						<h3>Ejemplos</h3>
						{examples.map(example => (
							<NavLink
								key={example.id}
								to={example.path}
								className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
							>
								{example.icon} {example.title}
							</NavLink>
						))}
					</div>
				</nav>
				<div className="sidebar-footer">
					<a href="https://github.com/user/reactive" target="_blank" rel="noopener noreferrer">
						GitHub
					</a>
				</div>
			</aside>
			<main className="main-content">
				<Outlet />
			</main>
		</div>
	);
}
