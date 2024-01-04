import React from 'react';
import { useBinder } from '@beyond-js/react-18-widgets/hooks';
import { Item } from './items';
import { TestContext } from './context';
import { Link } from 'pragmate-ui/components';

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

	return (
		<TestContext.Provider
			value={{ total: store.users.items?.length, totalSelected: selected.size, selected, store }}
		>
			<div className='page__container'>
				<header>
					<h1>Use cases</h1>
					<ul>
						<li>
							<Link href='/tests?case=backend-providers'>Backend providers</Link>
						</li>
						<li>
							<Link href='/tests?case=no-providers'>No providers</Link>
						</li>

						<li>
							<Link href='/tests?case=only-local'>Local data</Link>
						</li>
						<li>
							<Link href='/tests?case=local-and-remote'>Local and remote data</Link>
						</li>
					</ul>
				</header>
			</div>
		</TestContext.Provider>
	);
}
