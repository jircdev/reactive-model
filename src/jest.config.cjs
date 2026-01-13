module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	roots: ['<rootDir>'],
	testMatch: ['**/__tests__/source/**/*.test.ts'],
	moduleNameMapper: {
		// Para tests sobre código fuente: mapear a modules/
		'^reactive/events$': '<rootDir>/modules/events/index.ts',
		'^reactive/model$': '<rootDir>/modules/model/index.ts',
		'^reactive/entities/item$': '<rootDir>/modules/entities/item/index.ts',
		'^reactive/entities/collection$': '<rootDir>/modules/entities/collection/index.ts',
		'^reactive/structures/map$': '<rootDir>/modules/structures/map/index.ts',
		'^reactive/structures/array$': '<rootDir>/modules/structures/array/index.ts',
		'^reactive/structures/tree$': '<rootDir>/modules/structures/tree/index.ts',
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
	collectCoverageFrom: ['modules/**/*.ts', '!modules/**/*.d.ts', '!modules/**/__tests__/**'],
	coverageDirectory: 'coverage',
	coverageReporters: ['text', 'lcov', 'html'],
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
};
