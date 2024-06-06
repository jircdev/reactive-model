export interface IResponse {
	status: boolean;
	data: object;
}
export type ModelId = string | number;
export /*bundle*/ interface IProvider {
	publish?(properties: Record<string, any>): Promise<IResponse>;
	load?: (data: object) => Promise<any>;
	list?: (params: any) => Promise<any>;
	delete?: (id: ModelId) => Promise<any>;
	deleteItems?: (id: ModelId) => Promise<any>;
	[propName: string]: ((...args: any[]) => Promise<any>) | undefined;
}

export interface IItemProvider<T> {
	publish?: (properties: Record<string, any>) => Promise<IResponse>;
	load?: (data: object) => Promise<T[]>; // load retorna un arreglo de Items de tipo T
	delete?: (id: ModelId) => Promise<boolean>; // delete retorna un booleano

	// Index signature para métodos adicionales
	[propName: string]: ((...args: any[]) => Promise<any>) | undefined;
}

export interface IProviderConstructor {
	new (specs?): IProvider;
}
