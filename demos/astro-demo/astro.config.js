import { defineConfig } from 'astro/config'
import importableYAML from '@importable/yaml/astro'

export default defineConfig({
	integrations: [
		importableYAML()
	]
})
