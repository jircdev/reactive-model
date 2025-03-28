import { ReactiveModel } from '../src/modules/model';

interface IExample {
	name: string;
	id: string;
}

export class Example extends ReactiveModel<IExample> {
	declare name: string;
	declare id: string;
	declare pepito: string;

	constructor({ ...args }: Partial<IExample> = {}) {
		super({ ...args, properties: ['name', 'id'] });
		this.reactiveProps(['pepito']);
	}

	print() {
		return this.getProperty('name');
	}
}

// const instance = new Example();
// instance.on('name.changed', () => console.log('cambio el nombre a ', instance.name));
// instance.on('pepito.changed', () => console.log('cambio el pepito a ', instance.pepito));
// instance.name = 'nuevo nombre';
// instance.pepito = 'nuevo pepito';
// setTimeout(() => {
// 	instance.name = 'otro nombre';
// 	instance.pepito = 'otro pepito';
// 	console.log(12, instance.name);
// }, 1000);

// console.log(instance.id, instance.name);
