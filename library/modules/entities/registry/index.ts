import { PendingPromise } from '@beyond-js/kernel/core';
import { ReactiveModel } from '@beyond-js/reactive/model';
import { v4 as uuidv4 } from 'uuid';
interface IRegistry {
	values?: object;
	id?: string | number;
	__instanceId?: string;
}
export class Registry extends ReactiveModel<IRegistry> {
	#values: any = {};
	get values() {
		return this.#values;
	}
	#id;
	#store;
	#isDeleted;
	#isNew: boolean;
	__instanceId: string;

	get isNew() {
		return this.#isNew;
	}
	set isNew(value: boolean) {
		this.#isNew = value;
		this.triggerEvent();
	}

	#keyId;
	get isDeleted() {
		return this.#isDeleted;
	}
	set isDeleted(value) {
		if (value === this.#isDeleted) return;

		this.#isDeleted = value;
		this.triggerEvent();
	}

	constructor(store, data: IRegistry = { id: undefined }) {
		super();

		const { id } = data;
		this.#store = store;
		this.#isNew = id === undefined;
		this.#id = id;
		this.__instanceId = data.__instanceId ?? uuidv4();
		if (!id) this.#id = this.__instanceId;
		if (this.#id) this.#values.id = this.#id;
	}

	setValues = data => {
		if (!data) {
			return;
		}
		const props = Object.keys(data);
		let updated = false;

		if (!data.id) data.id = this.#id;

		const newValues = { ...this.#values };

		props.forEach(property => {
			if (data[property] === newValues[property]) return;
			newValues[property] = data[property];
			updated = true;
		});
		if (data.__instanceId) this.__instanceId = data.instanceId;
		newValues.isDeleleted = this.isDeleted === 1 ?? 0;
		this.#values = newValues;
		this.triggerEvent();

		return updated;
	};

	getValues() {
		const values = { ...this.#values };

		if (this.__instanceId) values.__instanceId = this.__instanceId;
		//		if (this.offline) values.offline = this.offline; // this line may be removed, the offline value must be set by the localProvider
		return values;
	}
}
