// @ts-check

/** @typedef {import('astro').AstroIntegration} AstroIntegration */

import importableYAML from './importable-machine-css-rollup.mjs'

export default (/** @type {any[]} */ ...args) => /** @type {AstroIntegration} */ ({
	name: '@importable/machine',
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
