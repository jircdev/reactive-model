export interface IResponse {
	status: boolean;
	data: object;
}
export /*bundle */ interface IProvider {
	publish?(properties: Record<string, any>): Promise<IResponse>;
	load?: (data: object) => Promise<any>;
	list?: (params: any) => Promise<any>;
	delete?: (id: string) => Promise<any>;
	deleteItems?: (id: string) => Promise<any>;
}

export interface IProviderConstructor {
	new (): IProvider;
}
