import { ReactiveConfig } from '@beyond-js/reactive/settings';
import { DefaultAdapter } from './default';
import { LegacyAdapter } from './legacy';

interface IResponseAdapter {
	toClient: (data: any) => any;
	fromRemote: (data: any) => any;
	fromRemoteList?: (data: any) => any;
}
export /*bundle*/ type TCustomAdapter = new () => IResponseAdapter;
export /*bundle*/ interface IConfig {
	adapter: 'default' | 'legacy' | TCustomAdapter;
}

export type TAdapters = 'default' | 'legacy' | TCustomAdapter;
export class ResponseAdapter {
	static get(parent, adapters?: IConfig['adapter']) {
		adapters = adapters ? adapters : ReactiveConfig.adapter;
		const Adapter = adapters === 'default' ? DefaultAdapter : LegacyAdapter;
		return new Adapter(parent);
	}
}
