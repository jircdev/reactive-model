export /*bundle */ interface IResponseAdapter {
	toClient: (data?: any) => any;
	fromRemote: (data: any) => any;
	fromRemoteList?: (data: any) => any;
}
