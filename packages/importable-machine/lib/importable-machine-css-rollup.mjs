// @ts-check

/** @typedef {import('rollup').Plugin} RollupPlugin */
/** @typedef {{ id: string | null, initial: string | null, context: any, states: { [name: string]: string[] } }} MachineConfig */

import { readFile } from 'node:fs/promises'
import { parse as parseCSS } from 'postcss'
import { parse as parseESM } from 'es-module-lexer'
import { testImportAttributes, testImportModuleSpecifier } from './importable-machine-css-tsconfig.mjs'

export const withIncrement = (id = '') => (
	`${id}.${Number(++__generateHashIncrement).toString(36)}.js`
)

let __generateHashIncrement = 5e5

export default (/** @type {any[]} */ ..._args) => {
	/** @type {Record<string, Record<string, any>>} */
	const assertions = Object.create(null)

	/** @type {Record<string, string>} */
	const virtualize = Object.create(null)

	return /** @type {RollupPlugin} */ ({
		name: '@importable/machine',
		enforce: 'pre',
		async resolveId(importee, importer, options) {
			const importNFO = await this.resolve(importee, importer, { ...Object(options), skipSelf: true })
			const importID = Object(importNFO).id || null

			if (importID !== null && testImportModuleSpecifier(importID)) {
				const cachedAssertions = Object(assertions[importer ?? '']?.[importee])
				const optionAssertions = Object.assign({}, options.assertions, cachedAssertions)

				if (testImportAttributes(optionAssertions)) {
					const hashedID = withIncrement(importID)

					virtualize[hashedID] = importID

					return {
						id: hashedID,
					}
				}
			}

			return importNFO
		},
		async load(importee) {
			if (importee in virtualize) {
				const fileName = virtualize[importee]
				const code = await readFile(fileName, 'utf-8')

				const machineNode = parseCSS(code, { from: fileName }).nodes[0]

				if (machineNode && machineNode.type === 'atrule' && machineNode.name === 'machine') {
					/** @type {MachineConfig} */
					const machineConfig = {
						id: machineNode.params || null,
						initial: null,
						context: null,
						states: {},
					}

					for (const node of machineNode.nodes) {
						if (node.type === 'decl') {
							if (node.prop === 'initial') {
								machineConfig.initial = node.value
							}
						} else if (node.type === 'atrule') {
							if (node.name === 'state') {
								const machineState = machineConfig.states[node.params] = Object(machineConfig.states[node.params])

								if (Array.isArray(node.nodes)) {
									for (const onAtRule of node.nodes) {
										if (onAtRule.type === 'atrule' && onAtRule.name === 'on') {
											const machineStateOn = machineState.on = Object(machineState.on)

											if (Array.isArray(onAtRule.nodes)) {
												for (const declNode of onAtRule.nodes) {
													if (declNode.type === 'decl' && declNode.prop === 'transition') {
														machineStateOn[onAtRule.params] = declNode.value
													}
												}
											}
										}
									}
								}
							} else if (node.name === 'context') {
								machineConfig.context = Object(machineConfig.context)

								if (Array.isArray(node.nodes)) {
									for (const declNode of node.nodes) {
										if (declNode.type === 'decl') {
											machineConfig.context[declNode.prop] = declNode.value
										}
									}
								}
							}
						}
					}

					return [
						`import { createMachine } from '@xstate/fsm'`,
						`export default createMachine(${JSON.stringify(machineConfig)})`,
					].join(';')
				}
			}
		},
		async transform(code, importee) {
			if (!/\.[cm]?[jt]s$/.test(importee)) return

			const [ moduleImports ] = parseESM(code)

			for (const moduleImport of moduleImports) {
				if (moduleImport.n && moduleImport.a > -1) {
					const assertionCode = code.slice(moduleImport.a, moduleImport.se)

					assertions[importee] = assertions[importee] || Object.create(null)

					if (!Object.hasOwn(assertions[importee], moduleImport.n)) {
						const { assertionJSON } = await import(/* @vite-ignore */ `data:application/javascript,export const assertionJSON=${assertionCode}`)

						assertions[importee][moduleImport.n] = assertionJSON
					}
				}
			}
		},
	})
}
