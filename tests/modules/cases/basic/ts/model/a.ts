import { ReactiveModel } from '@beyond-js/reactive/model';

interface IA {
	a: string;
	b: string;
}

export class A extends ReactiveModel<IA> {
	constructor() {
		super({ properties: ['a', 'b'] });
	}
}

globalThis.a = A;
