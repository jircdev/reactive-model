import * as React from 'react';
import { useBinder } from '@beyond-js/react-18-widgets/hooks';
import { useTestContext } from './context';

export /*bundle*/
function Item({ data }): JSX.Element {
	const { selected, onCheck, store } = useTestContext();

	function onDelete(e) {
		e.preventDefault();
		e.stopPropagation();
		store.deleteUser(data.id);
	}
	if (data.isDeleted) return null;
	const attrs = { checked: selected.has(data.id.toString()) };

	return (
		<li>
			<input type="checkbox" {...attrs} onChange={onCheck} value={data.id} />
			<div>{data.name}</div>
			<section>
				<button onClick={onDelete}>delete</button>
			</section>
		</li>
	);
}
