export /*bundle*/ interface ReactiveModelPublic<T> {
	ready: boolean | undefined;
	fetching: boolean | undefined;
	fetched: boolean;
	processing: boolean;
	processed: boolean;
	loaded: boolean;
	[key: string]: any;
}
