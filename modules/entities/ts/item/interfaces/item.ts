export interface IITem {
	provider: any;
	skeleton: Array<string>;
	isUnpublished: boolean;

	load: Function;

	unique: Array<string>;

	save(): Promise<{ status: boolean; error?: string }>;
	publish(): Promise<{ status: boolean; error?: string }>;
	localUpdate(data: any, broadcastUpdate?: boolean): Promise<{ status: boolean; error?: string }>;
	sync(): Promise<{ status: boolean; error?: string }>;
}
