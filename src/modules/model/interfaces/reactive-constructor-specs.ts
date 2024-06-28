export type ReactiveProps<T> = Partial<Omit<T, 'properties'>> & {
	properties: string[];
};
