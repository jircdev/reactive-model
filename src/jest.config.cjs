module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	roots: ['<rootDir>'],
	testMatch: ['**/__tests__/source/**/*.test.ts'],
	moduleNameMapper: {
		// Para tests sobre código fuente: mapear a modules/
		'^@beyond-js/reactive/events$': '<rootDir>/modules/events/index.ts',
		'^@beyond-js/reactive/model$': '<rootDir>/modules/model/index.ts',
		'^@beyond-js/reactive/entities/item$': '<rootDir>/modules/entities/item/index.ts',
		'^@beyond-js/reactive/entities/collection$': '<rootDir>/modules/entities/collection/index.ts',
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
