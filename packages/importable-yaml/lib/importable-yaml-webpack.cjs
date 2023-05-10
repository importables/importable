const { parse: parseYML } = require('yaml')

module.exports = (source) => `export default ${
	JSON.stringify(
		parseYML(
			source
		)
	)
}`
