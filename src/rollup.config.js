import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import { nodeResolve } from '@rollup/plugin-node-resolve';

// Dependencias externas base (nunca se incluyen en bundles)
const baseExternal = [
	'zod',
	'uuid',
	'@beyond-js/reactive/model',
	'@beyond-js/reactive/entities/item',
	'@beyond-js/reactive/entities/collection',
	'@beyond-js/reactive/events',
];

// Función para verificar si un módulo es externo
function isExternal(id, bundleExternals = []) {
	// Marcar como externas todas las dependencias base
	if (baseExternal.some(ext => id === ext || id.startsWith(ext + '/'))) {
		return true;
	}
	// Marcar dependencias internas específicas de este bundle como externas
	return bundleExternals.some(ext => id === ext || id.startsWith(ext + '/'));
}

// Función para crear configuración de bundle
function createBundleConfig(input, outputDir, bundleName, bundleExternals = []) {
	return [
		// Build ESM y CJS
		{
			input,
			output: [
				{
					file: `${outputDir}/index.mjs`,
					format: 'es',
					sourcemap: true,
				},
				{
					file: `${outputDir}/index.cjs`,
					format: 'cjs',
					sourcemap: true,
					exports: 'named',
				},
			],
			external: id => isExternal(id, bundleExternals),
			plugins: [
				nodeResolve(),
				typescript({
					tsconfig: './tsconfig.json',
					declaration: false,
					declarationMap: false,
				}),
			],
		},
		// Generar tipos TypeScript
		{
			input,
			output: {
				file: `${outputDir}/index.d.ts`,
				format: 'es',
			},
			external: id => isExternal(id, bundleExternals),
			plugins: [dts()],
		},
	];
}

export default [
	// Bundle: events (base, sin dependencias)
	...createBundleConfig('modules/events/index.ts', 'dist/events', 'events', []),

	// Bundle: model (depende de events)
	...createBundleConfig('modules/model/index.ts', 'dist/model', 'model', ['@beyond-js/reactive/events']),

	// Bundle: entities/item
	...createBundleConfig('modules/entities/item/index.ts', 'dist/entities/item', 'entities/item', [
		'@beyond-js/reactive/model',
	]),

	// Bundle: entities/collection
	...createBundleConfig('modules/entities/collection/index.ts', 'dist/entities/collection', 'entities/collection', [
		'@beyond-js/reactive/model',
		'@beyond-js/reactive/entities/item',
	]),
];
