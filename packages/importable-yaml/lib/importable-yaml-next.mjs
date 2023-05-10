// @ts-check

/** @typedef {import('next').NextConfig} NextConfig */
/** @typedef {{ (nextConfig: Partial<NextConfig>): NextConfig }} NextPlugin */

import { fileURLToPath } from 'node:url'

const loader = fileURLToPath(new URL('./importable-yaml-webpack.cjs', import.meta.url))

const rule = {
	test: /\.ya?ml$/,
	loader,
}

export default /** @type {NextPlugin} */ (
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
