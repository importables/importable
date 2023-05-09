// @ts-check

/** @typedef {import('rollup').Plugin} RollupPlugin */

import { readFile } from 'node:fs/promises'
import { parse as parseYML } from 'yaml'
import { testImportModuleSpecifier } from './importable-yaml-tsconfig.mjs'

export default (/** @type {any[]} */ ..._args) => /** @type {RollupPlugin} */ ({
	name: '@importable/yaml',
	async load(importee) {
		if (testImportModuleSpecifier(importee)) {
			return `export default ${
				JSON.stringify(
					parseYML(
						await readFile(importee, 'utf-8')
					)
				)
			}`
		}
	}
})
