import { defineConfig } from 'astro/config'
import importableMachine from '@importable/machine/astro'
import importableYAML from '@importable/yaml/astro'

export default defineConfig({
	integrations: [
		importableMachine(),
		importableYAML()
	]
})
