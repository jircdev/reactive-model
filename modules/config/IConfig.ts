interface IResponseAdapter {
	toClient: (data: any) => any;
	fromRemote: (data: any) => any;
	fromRemoteList?: (data: any) => any;
}
type TCustomAdapter = new () => IResponseAdapter;
export interface IConfig {
	adapter: 'legacy' | 'default' | TCustomAdapter;
}
