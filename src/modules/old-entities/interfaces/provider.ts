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
	bulkSave?: (data: object[]) => Promise<any>;
	deleteItems?: (id: ModelId) => Promise<any>;
}

export interface IItemProvider<T> {
	publish?: (properties: Record<string, any>) => Promise<IResponse>;
	load?: (data: object) => Promise<IResponse>; // load retorna un arreglo de Items de tipo T
	delete?: (id: ModelId) => Promise<IResponse>; // delete retorna un booleano
}

export interface IProviderConstructor {
	new (specs?): IProvider;
}
