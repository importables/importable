// @ts-check

/** @typedef {import('next').NextConfig} NextConfig */
/** @typedef {{ (nextConfig: Partial<NextConfig>): NextConfig }} NextPlugin */

import { resolve } from 'node:path'

const loader = resolve(__dirname, 'importable-yaml-webpack.cjs')

const rule = {
	test: /\.ya?ml$/,
	loader,
}

module.exports = /** @type {NextPlugin} */ (
	(nextConfig = {}) => {
		/** @type {NextConfig} */
		const appliedConfig = {
			webpack(config, options) {
				config.module.rules.push(rule)

				if (typeof nextConfig.webpack === 'function') {
					return nextConfig.webpack(config, options)
				}

				return config
			},
		}

		return Object.assign({}, nextConfig, appliedConfig)
	}
)
