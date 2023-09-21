import { IResponseAdapter } from './interface';

interface Iresponse {
	status: boolean;
	error?: any;
	data?: any;
}

interface IParams {
	status?: boolean;
	error?: any;
	data?: any;
}
export class LegacyAdapter implements IResponseAdapter {
	#parent;
	constructor(parent) {
		this.#parent = parent;
	}
	toClient({ error, data }: IParams): Iresponse {
		if (error) {
			return { status: false, error: { message: error } };
		}

		return { status: true, data };
	}

	fromRemote(response: IParams) {
		const { status, data, error } = response;
		if (!status) throw error ?? 'ERROR_DATA_QUERY';

		return data;
	}

	fromRemoteList(data: any): Promise<any> {
		return Promise.resolve(data);
	}
}
