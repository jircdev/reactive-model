import * as React from 'react';
import { useBinder } from '@beyond-js/react-18-widgets/hooks';
import { Item } from './items';
import { TestContext } from './context';

export /*bundle*/
function Page({ store }): JSX.Element {
	const ref = React.useRef<HTMLButtonElement>(null);

	const [ready, setReady] = React.useState(false);
	const [selected, setSelected] = React.useState(new Set());
	const [count, setCount] = React.useState(store.users?.items?.length ?? 0);
	useBinder([store], () => {
		setReady(store.ready);

		setCount(store.users?.items?.length ?? 0);
	});

	if (!ready) return <div>cargando....</div>;

	const onCheck = event => {
		if (!event.currentTarget) return;
		const { value } = event.currentTarget;

		setSelected(prev => new Set(prev.add(value)));
	};

	const onToggle = event => {
		const newset = new Set();
		if (selected.size === store.users.items.length) {
			setSelected(newset);
			return;
		}
		store.users.items.forEach(user => newset.add(user.id.toString()));
		setSelected(newset);
	};

	const users = store.users.items.map(user => <Item data={user} key={user.id} />);
	const onBulkDelete = event => {
		event.stopPropagation();

		store.deleteItems(Array.from(selected));
	};
	const props = { disabled: selected.size === 0 };
	console.log(12, props);
	return (
		<TestContext.Provider
			value={{ total: store.users.items?.length, totalSelected: selected.size, selected, onCheck, store }}
		>
			<div className="page__container">
				<header>
					<h1>Página de prueba</h1>
				</header>
				<button onClick={onToggle}>Select all</button>
				<button ref={ref} onClick={onBulkDelete} {...props}>
					Eliminar
				</button>
				<ul>{users}</ul>
			</div>
		</TestContext.Provider>
	);
}
