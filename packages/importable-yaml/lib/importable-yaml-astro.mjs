// @ts-check

/** @typedef {import('astro').AstroIntegration} AstroIntegration */

import importableYAML from './importable-yaml-rollup.mjs'

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
