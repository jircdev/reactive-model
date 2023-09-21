import { ReactiveConfig } from '@beyond-js/reactive/settings';
import { DefaultAdapter } from './default';
import { LegacyAdapter } from './legacy';

export type TCustomAdapter = {
	toClient: (data: any) => any;
	fromRemote: (data: any) => any;
};
export type TAdapters = 'default' | 'legacy' | TCustomAdapter;
export class ResponseAdapter {
	static get(parent, adapters?: TAdapters) {
		adapters = adapters ? adapters : ReactiveConfig.adapter;
		const Adapter = adapters === 'default' ? DefaultAdapter : LegacyAdapter;
		return new Adapter(parent);
	}
}
