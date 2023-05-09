// @ts-check

/** @typedef {import('importable').ImportablePlugin} ImportablePlugin */

import { parse as parseYML } from 'yaml'

export const testImportModuleSpecifier = /** @type {ImportablePlugin['testImportModuleSpecifier']} */ (moduleName) => (
	moduleName.endsWith('.yaml') ||
	moduleName.endsWith('.yml')
)

export const testImportAttributes = /** @type {ImportablePlugin['testImportAttributes']} */ (importAttributes) => (
	importAttributes.type === 'yaml' ||
	importAttributes.type === 'yml'
)

export const generateTypeScriptDefinition = /** @type {ImportablePlugin['generateTypeScriptDefinition']} */ (_fileName, _importAttributes, code) => (
	`export default Object as ${
		JSON.stringify(
			parseYML(code)
		)
	}`
)
