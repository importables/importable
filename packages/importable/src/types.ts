import type ts from 'typescript/lib/tsserverlibrary'

export type { ts }

export type Plugin = ts.server.PluginModuleFactory

export interface DefinePlugin {
	(plugin: Plugin): typeof plugin
}

export interface ImportAttributes {
	[name: string]: string
}

export interface Check {
	(fileName: string, assertions: ImportAttributes): boolean
}

export interface CheckFileName {
	(fileName: string): boolean
}

export interface Transform {
	(fileName: string, code: string, importAttributes: ImportAttributes): string
}

export interface ImportablePlugin {
	generateTypeScriptDefinition(importModuleSpecifier: string, importAttributes: ImportAttributes, code: string): string
	testImportAttributes(importAttributes: ImportAttributes): boolean
	testImportModuleSpecifier(importModuleSpecifier: string): boolean
}
