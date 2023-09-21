import { IConfig } from './IConfig';

export /*bundle */ class ReactiveConfig {
	static #config: IConfig;
	static adapter = 'legacy';
	static set(config: IConfig) {
		this.#config = config;
		const properties = Object.keys(config);
		properties.forEach(property => {
			ReactiveConfig[property] = config[property];
		});
	}
}
