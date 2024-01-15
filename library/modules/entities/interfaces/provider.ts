export interface IResponse {
	status: boolean;
	data: object;
}
export interface IProvider {
	publish?(properties: Record<string, any>): Promise<IResponse>;
	load?: (data: object) => Promise<any>;
	list?: (params: any) => Promise<any>;
	delete?: (id: string) => Promise<any>;
	deleteItems?: (id: string) => Promise<any>;
	[propName: string]: ((...args: any[]) => Promise<any>) | undefined;
}

export interface IProviderConstructor {
	new (specs?): IProvider;
}
