import React from 'react';
import { useBinder } from '@beyond-js/react-18-widgets/hooks';
import { Item } from './items';
import { TestContext } from './context';
import { Link } from 'pragmate-ui/components';
import { Users } from '@beyond-js/reactive-tests/examples/models';
import { List } from './list';

export /*bundle*/
function Page({ store }): JSX.Element {
	const ref = React.useRef<HTMLButtonElement>(null);
	const [users, setUsers] = React.useState<Users>();
	const [fetching, setFetching] = React.useState(false);
	const [fetched, setFetched] = React.useState(false);

	const load = () => {
		console.log(0.2);

		const users = new Users();
		setUsers(users);
		const onChange = () => {
			setFetching(users.fetching);
			setFetched(users.fetched);
		};
		users.on('change', onChange);
	};
	React.useEffect(load, []);

	const onClick = async () => {
		await users.load();
	};

	return (
		<>
			<button onClick={onClick}>Cargar</button>
			{fetching && <div>Cargando...</div>}
			
			{fetched && <div>Datos Cargados... total elementos: {users.items.length}</div>}
		</>
	);
}
