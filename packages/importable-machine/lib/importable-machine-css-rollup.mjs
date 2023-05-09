// @ts-check

/** @typedef {import('rollup').Plugin} RollupPlugin */

import { readFile } from 'node:fs/promises'
import { parse as parseCSS } from 'postcss'
import { testImportModuleSpecifier } from './importable-machine-css-tsconfig.mjs'

export default (/** @type {any[]} */ ..._args) => /** @type {RollupPlugin} */ ({
	name: '@importable/machine',
	async load(importee) {
		if (testImportModuleSpecifier(importee)) {
			return `export default ${
				JSON.stringify(
					parseCSS(
						await readFile(importee, 'utf-8')
					)
				)
			}`
		}
	}
})
