// @ts-check

/** @typedef {import('rollup').Plugin} RollupPlugin */

import { readFile } from 'node:fs/promises'
import { parse as parseKDL } from 'kdljs'
import { testImportModuleSpecifier } from './importable-document-kdl-tsconfig.mjs'

export default (/** @type {any[]} */ ..._args) => /** @type {RollupPlugin} */ ({
	name: '@importable/yaml',
	async load(importee) {
		if (testImportModuleSpecifier(importee)) {
			return `export default ${
				JSON.stringify(
					getKDL(
						await readFile(importee, 'utf-8')
					)
				)
			}`
		}
	}
})

const getKDL = (/** @type {string} */ code) => getSanitizedKDL(
	/** @type {any} */ (
		parseKDL(code).output
	)
)

const getSanitizedKDL = (/** @type {Node[]} */ nodes) => (
	nodes.length === 1 ? getSanitizeKDLNode(nodes[0]) : nodes.map(getSanitizeKDLNode)
)

const getSanitizeKDLNode = (/** @type {Node} */ node) => parseJSON(
	stringify(node, replacerOfKDL, '\t')
)

const replacerOfKDL = (/** @type {string} */ key, /** @type {any} */ value) => (
	key === 'tags' ||
	stringify(value) === '{}' ||
	stringify(value) === '[]'
		? undefined
	: value
)

const { parse: parseJSON, stringify } = JSON
