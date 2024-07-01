/**
 * File: index.ts
 */
import { IConfig } from './interface';

export /*bundle */ class ReactiveConfig {
	static #config: IConfig;
	static adapter: IConfig['adapter'] = 'legacy';
	static set(config: IConfig) {
		this.#config = config;
		const properties = Object.keys(config);
		properties.forEach(property => {
			ReactiveConfig[property] = config[property];
		});
	}
}


// ReactiveConfig.set({adapter: 'default'});
/**
 * File: interface.ts
 */
interface IResponseAdapter {
	toClient: (data: any) => any;
	fromRemote: (data: any) => any;
	fromRemoteList?: (data: any) => any;
}
export /*bundle*/ type TCustomAdapter = new () => IResponseAdapter;
export /*bundle*/ interface IConfig {
	adapter: 'default' | 'legacy' | TCustomAdapter;
}

