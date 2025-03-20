import { ReactiveModel } from '@aimpact/reactive/model';
import { v4 as uuidv4 } from 'uuid';

export class Registry extends ReactiveModel<Registry> {
	#id: any;
	#instanceId: any;
	#isDeleted: boolean = false;

	#draft: boolean = false;

	#state: 'draft' | 'published' | 'deleted' = 'draft';
	get state() {
		return this.#state;
	}
	get draft() {
		return this.#draft;
	}
	set draft(value: boolean) {
		if (value === this.#draft) return;
		this.#draft = value;
		this.triggerEvent();
	}

	get id() {
		return this.#id || this.#values.id;
	}

	get instanceId() {
		return this.#instanceId;
	}

	#values: any;
	get values() {
		return this.#values;
	}

	get deleted(): boolean {
		return this.#isDeleted;
	}

	set deleted(value: boolean) {
		if (value === this.#isDeleted) return;
		this.#isDeleted = value;

		this.trigger('record.deleted', this.#values);
		this.triggerEvent();
	}
	#entity: string;

	constructor(entity, { properties, ...data } = { id: undefined, properties: [], instanceId: undefined }) {
		super({ properties: properties || [] });

		this.#entity = entity;
		const { id } = data;
		this.#instanceId = data?.instanceId ? data.instanceId : uuidv4();

		this.#id = id;
		this.#draft = !id;
		this.#values = { ...data, id: this.#id };
		this.#state = this.#id ? 'published' : 'draft';
		this.setValues(this.#values);
	}

	private updateValue(key, value): void {
		this.#values[key] = value;
	}

	setValues(data, published = false): boolean {
		if (!data) return false;
		const baseState = this.#state;
		if (published) this.#state = 'published';
		let updated = false;

		for (const key in data) {
			if (Object.prototype.hasOwnProperty.call(data, key)) {
				const property = key;
				const value = data[property];
				if (value === this.#values[property]) continue;

				this.updateValue(property, value);
				updated = true;
			}
		}

		if (baseState !== this.#state && this.#state === 'published') {
			this.trigger('record.published', { ...this.#values });
			return updated;
		}
		if (!updated) return updated;

		this.trigger('change', { values: this.#values });
		this.trigger('record.updated', { ...this.#values });

		return updated;
	}

	getValues() {
		return { ...this.#values };
	}
}
