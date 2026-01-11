import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Suspense } from 'react';
import { Layout } from '@/layout/Layout';
import { examples } from '@/examples';
import { IndexPage } from '@/pages/IndexPage';

// Create routes from examples
const exampleRoutes = examples.map(example => ({
	path: example.path,
	element: (
		<Suspense fallback={<div className="loading">Cargando ejemplo...</div>}>
			<example.component />
		</Suspense>
	),
}));

const router = createBrowserRouter([
	{
		path: '/',
		element: <Layout />,
		children: [
			{
				index: true,
				element: <IndexPage />,
			},
			...exampleRoutes,
		],
	},
]);

export function AppRouter() {
	return <RouterProvider router={router} />;
}
