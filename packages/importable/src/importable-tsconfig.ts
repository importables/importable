import type * as TS from './types.ts'

export type { ImportablePlugin, ImportAttributes } from './types.ts'

import * as util from './utils.ts'

export default util.definePluginModuleFactory((modules) => {
	const ts = modules.typescript

	const assertionMap = Object.create(null) as Record<string, {
		resolvedFileName: string
		importAttributes: TS.ImportAttributes
	}>

	let importablePlugins: TS.ImportablePlugin

	return {
		create(info) {
			const pluginsOptions = info.config

			importablePlugins = util.loadImportablePlugins(pluginsOptions.plugins)

			const createModuleResolver = (containingFile: string) => (moduleName: string, assertClause: TS.ts.AssertClause) => {
				const resolvedFileName = util.getPath(util.getDirName(containingFile), moduleName)
				const importAttributes = util.getImportAttributes(assertClause)

				if (
					importablePlugins.testImportModuleSpecifier(resolvedFileName) &&
					importablePlugins.testImportAttributes(importAttributes)
				) {
					const moduleHash = util.generateHash()
					const hashedFileName = `${util.separator}${moduleHash}${util.separator}..${resolvedFileName}`

					assertionMap[hashedFileName] = { resolvedFileName, importAttributes }

					return <TS.ts.ResolvedModuleFull>{
						extension: ts.Extension.Dts,
						isExternalLibraryImport: false,
						resolvedFileName: hashedFileName,
					}
				}
			}

			const getDtsSnapshot = (fileName: string, importAttributes: TS.ImportAttributes, code: string) => (
				ts.ScriptSnapshot.fromString(
					importablePlugins.generateTypeScriptDefinition(fileName, importAttributes, code)
				)
			)

			const languageServiceHost = <Partial<TS.ts.LanguageServiceHost>>{
				resolveModuleNameLiterals(moduleNames, containingFile, ...rest) {
					if (!info.languageServiceHost.resolveModuleNameLiterals) {
						return undefined
					}

					const resolvedModules = info.languageServiceHost.resolveModuleNameLiterals(moduleNames, containingFile, ...rest)

					const moduleResolver = createModuleResolver(containingFile)

					return moduleNames.map((module, index) => {
						try {
							const resolvedModule = moduleResolver(module.text, Object(module.parent).assertClause)

							if (resolvedModule) {
								return {
									resolvedModule
								}
							}
						} catch {
							// do nothing and continue
						}

						return resolvedModules[index]
					})
				},

				getScriptSnapshot(fileName) {
					const snapshot = info.languageServiceHost.getScriptSnapshot(fileName)
					const code = snapshot !== undefined && 'text' in snapshot ? snapshot.text : undefined

					if (typeof code !== 'string') return snapshot
					if (/\.[cm]?[jt]s$/.test(fileName)) return snapshot
					if (!importablePlugins.testImportModuleSpecifier(fileName)) return snapshot
					if (!(fileName in assertionMap)) return snapshot

					const { resolvedFileName, importAttributes } = assertionMap[fileName]

					return getDtsSnapshot(resolvedFileName, importAttributes, code)
				},
			}

			return ts.createLanguageService(
				new Proxy(info.languageServiceHost, {
					get(target, key: keyof TS.ts.LanguageServiceHost) {
						return (
							key in languageServiceHost
								? languageServiceHost[key]
							: target[key]
						)
					},
				})
			)
		},

		getExternalFiles(project: TS.ts.server.ConfiguredProject): string[] {
			return project.getFileNames().filter(
				fileName => importablePlugins.testImportModuleSpecifier(fileName)
			)
		},
	}
})
