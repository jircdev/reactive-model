import { PageReactWidgetController } from '@beyond-js/react-18-widgets/page';
import { Page } from './views';
import { Store } from './store';

export /*bundle*/
class Controller extends PageReactWidgetController {
	get Widget() {
		return Page;
	}
	#store;

	createStore(language?: string) {
		this.#store = new Store();
		return this.#store;
	}
	show() {
		// const user = new User(1);
	}
}
