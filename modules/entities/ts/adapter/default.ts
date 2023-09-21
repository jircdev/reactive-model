import { IResponseAdapter } from './interface';

export class DefaultAdapter implements IResponseAdapter {
	toClient(data: any) {
		return Promise.resolve(data);
	}

	fromRemote(data: any) {
		return Promise.resolve(data);
	}

	fromRemoteList(data: any) {
		return Promise.resolve(data);
	}
}
