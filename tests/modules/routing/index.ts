import { routing } from '@beyond-js/kernel/routing';

routing.redirect = async function redirect(uri): Promise<string> {
	if (uri.pathname === '/') return '/home-reactive';
	return uri.pathname;
};
