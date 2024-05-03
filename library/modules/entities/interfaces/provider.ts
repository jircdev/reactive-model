export interface IResponse {
	status: boolean;
	data: object;
}
export /*bundle*/ interface IProvider {
	publish?(properties: Record<string, any>): Promise<IResponse>;
	load?: (data: object) => Promise<any>;
	list?: (params: any) => Promise<any>;
	delete?: (id: string) => Promise<any>;
	deleteItems?: (id: string) => Promise<any>;
	[propName: string]: ((...args: any[]) => Promise<any>) | undefined;
}

export interface IItemProvider<T> {
	publish?: (properties: Record<string, any>) => Promise<IResponse>;
	load?: (data: object) => Promise<T[]>; // load retorna un arreglo de Items de tipo T
	delete?: (id: string) => Promise<boolean>; // delete retorna un booleano

	// Index signature para métodos adicionales
	[propName: string]: ((...args: any[]) => Promise<any>) | undefined;
}

export interface IProviderConstructor {
	new (specs?): IProvider;
}
