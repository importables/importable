// @ts-check

/** @typedef {import('astro').AstroIntegration} AstroIntegration */

import importableYAML from './importable-document-kdl-rollup.mjs'

export default (/** @type {any[]} */ ...args) => /** @type {AstroIntegration} */ ({
	name: '@importable/yaml',
	hooks: {
		'astro:config:setup': ({ updateConfig }) => {
			updateConfig({
				vite: {
					plugins: [
						importableYAML(...args),
					],
				},
			});
		},
	},
})
