import * as React from 'react';


export /*bundle*/
function Page({ store }): JSX.Element {
	const ref = React.useRef<HTMLButtonElement>(null);

	console.log(store);

	return (
		<div className="page__container">
			<header>
				<h1>Página de prueba</h1>
			</header>
			<button ref={ref}>Haz click</button>
		</div>
	);
}
