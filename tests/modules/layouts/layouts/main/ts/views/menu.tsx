import React from 'react';
import { List } from 'pragmate-ui/list';
import { ItemMenu } from './item-menu';

export function Menu() {
	const items = [{ href: '/basic', label: 'Basic' }];
	return (
		<aside className='test-menu'>
			<h3>Examples</h3>
			<List items={items} control={ItemMenu} />
		</aside>
	);
}
