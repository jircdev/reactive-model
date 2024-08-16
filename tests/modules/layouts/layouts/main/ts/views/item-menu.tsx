import React from 'react';
import { Link } from 'pragmate-ui/link';
export function ItemMenu({ item: { href, label }, children }) {
	return (
		<li>
			<Link href={href}>{label}</Link>
		</li>
	);
}
