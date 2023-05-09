// @ts-check

/** @typedef {import('importable').ImportablePlugin} ImportablePlugin */
/** @typedef {import('postcss').AtRule} AtRuleNode */
/** @typedef {{ id: string | null, initial: string | null, context: any, states: { [name: string]: string[] } }} MachineConfig */

const { parse: parseCSS } = require('postcss')

exports.testImportModuleSpecifier = /** @type {ImportablePlugin['testImportModuleSpecifier']} */ (moduleName) => (
	moduleName.endsWith('.css')
)

exports.testImportAttributes = /** @type {ImportablePlugin['testImportAttributes']} */ (importAttributes) => (
	importAttributes.type === 'machine' &&
	importAttributes.from === 'css'
)

exports.generateTypeScriptDefinition = /** @type {ImportablePlugin['generateTypeScriptDefinition']} */ (fileName, _importAttributes, code) => {
	const rootNode = parseCSS(code, { from: fileName }).nodes[0]

	if (rootNode && rootNode.type === 'atrule' && rootNode.name === 'machine') {
		return getMachineDTS(rootNode)
	}

	return `export default null as never`
}

const { stringify } = JSON

const getMachineDTS = (/** @type {AtRuleNode} */ machineNode) => {
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
				const states = machineConfig.states[node.params] = machineConfig.states[node.params] || []

				if (Array.isArray(node.nodes)) {
					for (const onAtRule of node.nodes) {
						if (onAtRule.type === 'atrule' && onAtRule.name === 'on') {
							states.push(onAtRule.params)
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

	return generateMachineDTS(machineConfig)
}

const generateMachineDTS = (/** @type {MachineConfig} */ {
	id = '',
	initial = '',
	context = {},
	states = {}
}) => [
	`import type { StateMachine } from "@xstate/fsm"`,
	``,
	`type MachineID = ${stringify(id)}`,
	`type ConfigInitial = ${stringify(initial)}`,
	`type Context = ${stringify(Object(context))}`,
	`type States = {\n${
		Object.entries(states).reduce(
			(/** @type {string[]} */ stateDTS, [ stateName, stateNames ]) => {
				stateDTS.push(
					`\t${
						stringify(stateName)
					}: ${
						stateNames.map(stateName => stringify(stateName)).join(' | ')
					}`
				)

				return stateDTS
			},
			[]
		).join('\n')
	}\n}`,
	`type EventType = States[keyof States]`,
	`type Event = { type: EventType }`,
	`type State = { value: keyof States; context: Context }`,
	``,
	`export default Object as StateMachine.Machine<Context, Event, State> & {`,
		`config: {`,
			`id: MachineID`,
			`initial: ConfigInitial`,
			`context: Context`,
			`states: {`,
				`[StateName in keyof States]: {`,
					`on: {`,
						`[K in States[StateName]]: SingleOrArray<`,
							`StateMachine.Transition<`,
								`Context,`,
								`Event extends { type: K; } ? Event : never`,
							`>`,
						`>`,
					`}`,
					`exit: SingleOrArray<StateMachine.Action<Context, Event>>`,
					`entry: SingleOrArray<StateMachine.Action<Context, Event>>`,
				`}`,
			`}`,
		`}`,
		`initialState: StateMachine.State<Context, Event, State>`,
		`transition(`,
			`state: keyof States | StateMachine.State<Context, Event, State>,`,
			`event: EventType | Event`,
		`): StateMachine.State<Context, Event, State>`,
	`}`,
].join('\n')
