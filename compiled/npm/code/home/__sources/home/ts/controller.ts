import { PageReactWidgetController } from "@beyond-js/react-18-widgets/page";
import { Page } from "./views";
import { User } from "@beyond-js/reactive/examples/models";

export /*bundle*/
class Controller extends PageReactWidgetController {
	get Widget() {
		return Page;
	}

	constructor(a) {
		super(a);
		const user = new User();
		console.log(10, user);
	}
}
