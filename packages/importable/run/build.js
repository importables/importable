// @ts-check

import { rollup, defineInputOptions, defineOutputOptions, getPath, mkdir, rm, writeFile } from './rollup.js'
import typescript from '@rollup/plugin-typescript'

const importMetaDir = getPath('./')

process.chdir(importMetaDir)

const inputOptions = defineInputOptions({
	input: getPath('./src/importable-tsconfig.ts'),
	external: [
		'node:crypto',
		'node:path',
		'node:util'
	],
	plugins: [
		typescript({
			tsconfig: getPath('../../tsconfig.json'),

			// Type Checking
			strict: true,

			// Modules
			allowArbitraryExtensions: true,
			allowImportingTsExtensions: true,
			module: 'ESNext',
			moduleResolution: 'bundler',

			// Emit
			declaration: true,
			declarationDir: getPath('./lib/'),
			noEmit: true,
			sourceMap: true,

			// Interop Constraints
			esModuleInterop: true,
			forceConsistentCasingInFileNames: true,

			// Language and Environment
			target: 'ESNext',

			// Completeness
			skipLibCheck: true,
		})
	],
})

const outputDir = getPath('./lib/')

const outputOptionsList = defineOutputOptions({
	file: getPath('./lib/importable-tsconfig.mjs'),
	format: 'esm',
	sourcemap: true,
}, {
	file: getPath('./lib/importable-tsconfig.cjs'),
	format: 'cjs',
	sourcemap: true,
})

try {
	const bundle = await rollup(inputOptions)

	await rm(outputDir, { force: true, recursive: true })
	await mkdir(outputDir, { recursive: true })

	for (const outputOptions of outputOptionsList) {
		const { output } = await bundle.generate(outputOptions)

		for (const chunkOrAsset of output) {
			const fileName = getPath(`./lib/${chunkOrAsset.fileName}`)
			const contents = chunkOrAsset.type === 'asset' ? chunkOrAsset.source : chunkOrAsset.code

			await writeFile(fileName, contents)
		}
	}

	bundle.close()
} catch (error) {
	console.error(error)
}
