import { IResponseAdapter } from './interface';

interface Iresponse {
	status: boolean;
	error?: any;
	data?: any;
}
type ErrorApi = {
	message?: string;
	text?: string;
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
	toClient(response: IParams = {}): Iresponse {
		// if (error) {
		// 	return { status: false, error: { message: error } };
		// }

		// return { status: true, data };
		return response;
	}

	fromRemote(response: IParams) {
		const { status, data, error, message } = response;

		// if (!status) {
		// 	if (message) throw message;
		// 	if (typeof error === 'object') {
		// 		throw new Error(error?.text || error?.message || 'ERROR_DATA_QUERY');
		// 	}

		// 	typeof error === 'string' ? error : 'ERROR_DATA_QUERY';
		// }

		return response;
	}

	fromRemoteList(data: any): Promise<any> {
		return Promise.resolve(data);
	}
}
