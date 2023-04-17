export interface IResponse {
	status: boolean;
	data: object;
}
export /*bundle */ interface IProvider {
	publish(properties: Record<string, any>): Promise<IResponse>;
	load: (data: object) => Promise<any>;
	data: (params: any) => Promise<any>;
}
