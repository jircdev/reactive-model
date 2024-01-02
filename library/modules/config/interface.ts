interface IResponseAdapter {
	toClient: (data: any) => any;
	fromRemote: (data: any) => any;
	fromRemoteList?: (data: any) => any;
}
export /*bundle*/ type TCustomAdapter = new () => IResponseAdapter;
export /*bundle*/ interface IConfig {
	adapter: 'default' | 'legacy' | TCustomAdapter;
}
