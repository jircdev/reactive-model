import * as React from 'react';
import { Menu } from './menu';

declare global {
	namespace JSX {
		interface IntrinsicElements {
			'beyond-layout-children': any;
		}
	}
}

export function Layout() {
	return (
		<main className='beyond-docs-layout'>
			<Menu />
			<beyond-layout-children />
		</main>
	);
}
