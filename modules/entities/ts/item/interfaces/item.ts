export interface IITem {
	provider: any;
	skeleton: Array<string>;
	isUnpublished: boolean;
	save: Function;
	load: Function;
	publish: Function;
	unique: Array<string>;
	sync: Function;
}
