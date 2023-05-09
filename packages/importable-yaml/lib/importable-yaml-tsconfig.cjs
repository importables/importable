// @ts-check

const { parse: parseYML } = require('yaml')

/** @typedef {import('importable').ImportablePlugin} ImportablePlugin */

exports.testImportModuleSpecifier = /** @type {ImportablePlugin['testImportModuleSpecifier']} */ (moduleName) => (
	moduleName.endsWith('.yaml') ||
	moduleName.endsWith('.yml')
)

exports.testImportAttributes = /** @type {ImportablePlugin['testImportAttributes']} */ (importAttributes) => (
	importAttributes.type === 'yaml' ||
	importAttributes.type === 'yml'
)

exports.generateTypeScriptDefinition = /** @type {ImportablePlugin['generateTypeScriptDefinition']} */ (_fileName, _importAttributes, code) => (
	`export default Object as ${
		JSON.stringify(
			parseYML(code)
		)
	}`
)
