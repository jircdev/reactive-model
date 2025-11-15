module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	roots: ['<rootDir>'],
	testMatch: ['**/__tests__/bundles/**/*.test.ts'],
	moduleNameMapper: {
		// Para tests sobre bundles: mapear a dist/
		'^@beyond-js/reactive/events$': '<rootDir>/dist/events/index.mjs',
		'^@beyond-js/reactive/model$': '<rootDir>/dist/model/index.mjs',
		'^@beyond-js/reactive/entities/item$': '<rootDir>/dist/entities/item/index.mjs',
		'^@beyond-js/reactive/entities/collection$': '<rootDir>/dist/entities/collection/index.mjs',
	},
	transform: {
		'^.+\\.ts$': [
			'ts-jest',
			{
				tsconfig: {
					module: 'commonjs',
					target: 'ES2018',
					moduleResolution: 'node',
					esModuleInterop: true,
					allowSyntheticDefaultImports: true,
					skipLibCheck: true,
				},
			},
		],
	},
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'mjs'],
};
