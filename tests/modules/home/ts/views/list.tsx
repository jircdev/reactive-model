import React from 'react';
import { useBinder } from '@beyond-js/react-18-widgets/hooks';
import { Item } from './items';
import { TestContext } from './context';
import { Link } from 'pragmate-ui/components';
import { Users } from '@beyond-js/reactive-tests/examples/models';

export /*bundle*/
function List({ items }): JSX.Element {
	if (!items) return null;

	const output = items.map((item, index) => <li key={item.id}>{item.name}</li>);
	return <ul>{output}</ul>;
}
