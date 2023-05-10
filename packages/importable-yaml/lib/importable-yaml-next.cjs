// @ts-check

/** @typedef {import('next').NextConfig} NextConfig */
/** @typedef {{ (nextConfig: Partial<NextConfig>): NextConfig }} NextPlugin */

const { parse: parseYML } = require('yaml')

module.exports = () => /** @type {NextPlugin} */ (nextConfig = {}) => Object.assign({}, nextConfig, /** @type {NextConfig} */ ({
	webpack(config, options) {
		config.module.rules.push({
			test: /\.ya?ml$/,
			use: [
				{
					loader(code = '') {
						return `module.exports = ${
							JSON.stringify(
								parseYML(code)
							)
						}`
					},
				},
			],
		})

		if (typeof nextConfig.webpack === 'function') {
			return nextConfig.webpack(config, options)
		}

		return config
	},
}))
