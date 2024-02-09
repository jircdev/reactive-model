import { IResponseAdapter } from './interface';

interface Iresponse {
	status: boolean;
	error?: any;
	data?: any;
}
type ErrorApi = {
	message?: string;
	id: string | number;
};
type ErrorMessage = string;
interface IParams {
	status?: boolean;
	error?: ErrorApi | ErrorMessage;
	data?: any;
	message?: string;
}
export class LegacyAdapter implements IResponseAdapter {
	#parent;
	constructor(parent) {
		this.#parent = parent;
	}
	toClient({ error, data }: IParams = {}): Iresponse {
		if (error) {
			return { status: false, error: { message: error } };
		}

		return { status: true, data };
	}

	fromRemote(response: IParams) {
		const { status, data, error, message } = response;

		if (!status) {
			if (message) throw message;
			throw typeof error === 'string' ? error : 'ERROR_DATA_QUERY';
		}

		return data;
	}

	fromRemoteList(data: any): Promise<any> {
		return Promise.resolve(data);
	}
}
