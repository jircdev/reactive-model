export /*bundle*/ type ReactiveProps<T> = Partial<Omit<T, 'properties'>> & {
	properties?: (keyof T)[];
};
