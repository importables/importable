// @ts-check

/** @typedef {import('importable').ImportablePlugin} ImportablePlugin */
/** @typedef {import('kdljs').kdljs.Node} Node */

const { parse: parseKDL } = require('kdljs')

exports.testImportModuleSpecifier = /** @type {ImportablePlugin['testImportModuleSpecifier']} */ (moduleName) => (
	moduleName.endsWith('.kdl')
)

exports.testImportAttributes = /** @type {ImportablePlugin['testImportAttributes']} */ (importAttributes) => (
	importAttributes.type === 'document' &&
	importAttributes.from === 'kdl'
)

exports.generateTypeScriptDefinition = /** @type {ImportablePlugin['generateTypeScriptDefinition']} */ (_fileName, _importAttributes, code) => {
	return `export default Object as ${
		stringify(
			getKDL(code)
		)
	}`
}

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