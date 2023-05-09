import type * as TS from './types.ts'

export { dirname as getDirName, resolve as getPath, sep as separator } from 'node:path'

export const generateHash = () => (
	`with-${Number(++__generateHashIncrement).toString(36)}`
)

let __generateHashIncrement = 5e5

export const definePluginModuleFactory = Object as TS.DefinePlugin

export const loadImportablePlugins = (importablePluginNames: any[]): TS.ImportablePlugin => {
	const importablePlugins = __getImportablePlugins(importablePluginNames)

	return {
		testImportModuleSpecifier(importModuleSpecifier: string) {
			return importablePlugins.some(
				importablePlugin => importablePlugin.testImportModuleSpecifier(importModuleSpecifier)
			)
		},
		testImportAttributes(importAttributes: TS.ImportAttributes) {
			return importablePlugins.some(
				importablePlugin => importablePlugin.testImportAttributes(importAttributes)
			)
		},
		generateTypeScriptDefinition(importModuleSpecifier: string, importAttributes: TS.ImportAttributes, code: string) {
			const importablePlugin = importablePlugins.find(
				importablePlugin => (
					importablePlugin.testImportModuleSpecifier(importModuleSpecifier) &&
					importablePlugin.testImportAttributes(importAttributes)
				)
			) || defaultImportablePlugin

			return importablePlugin.generateTypeScriptDefinition(importModuleSpecifier, importAttributes, code)
		},
	}
}

const __getImportablePlugins = (plugins: any[]): TS.ImportablePlugin[] => asArray(plugins, [] as string[]).reduce(
	(plugins: TS.ImportablePlugin[], plugin) => {
		try {
			const loadedPlugin = Object(require(plugin))

			plugins.push(loadedPlugin)
		} catch (error) {
			console.error(`COULD NOT LOAD PLUGIN: ${plugin}`)
			console.error(Object(error).message || error)
		}

		return plugins
	},
	[]
)

export const testImportModuleSpecifier = (fileName: string, plugins: TS.ImportablePlugin[]) => plugins.some(
	plugin => plugin.testImportModuleSpecifier(fileName)
)

export const defaultImportablePlugin: TS.ImportablePlugin = {
	testImportModuleSpecifier(_importModuleSpecifier) {
		return false
	},
	testImportAttributes(_importAttributes) {
		return false
	},
	generateTypeScriptDefinition(_moduleName, _code) {
		return `export default null as never`
	},
}

export const asArray = <T = any>(value: ArrayLike<T>, fallback: T[] = []): T[] => Array.isArray(value) ? value : fallback

export const getImportAttributes = (assertClause: TS.ts.AssertClause) => asArray(Object(assertClause).elements).reduce(
	(importAttributes: TS.ImportAttributes, element: TS.ts.AssertEntry) => {
		const name = element.name.text
		const value = Object(element.value).text as string

		importAttributes[name] = value

		return importAttributes
	},
	Object.create(null)
) as TS.ImportAttributes
