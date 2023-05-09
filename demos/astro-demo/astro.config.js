import { defineConfig } from 'astro/config'
import importableDocument from '@importable/document/astro'
import importableMachine from '@importable/machine/astro'
import importableYAML from '@importable/yaml/astro'

export default defineConfig({
	integrations: [
		importableDocument(),
		importableMachine(),
		importableYAML()
	]
})
