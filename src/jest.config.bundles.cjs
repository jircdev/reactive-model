module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	roots: ['<rootDir>'],
	testMatch: ['**/__tests__/bundles/**/*.test.ts'],
	moduleNameMapper: {
		// Para tests sobre bundles: mapear a dist/
		'^reactive/events$': '<rootDir>/dist/events/index.mjs',
		'^reactive/model$': '<rootDir>/dist/model/index.mjs',
		'^reactive/entities/item$': '<rootDir>/dist/entities/item/index.mjs',
		'^reactive/entities/collection$': '<rootDir>/dist/entities/collection/index.mjs',
		'^reactive/structures/map$': '<rootDir>/dist/structures/map/index.mjs',
		'^reactive/structures/array$': '<rootDir>/dist/structures/array/index.mjs',
		'^reactive/structures/tree$': '<rootDir>/dist/structures/tree/index.mjs',
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
