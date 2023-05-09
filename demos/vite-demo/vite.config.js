import { defineConfig } from 'vite'
import importableYAML from '@importable/yaml/vite'

export default defineConfig({
	plugins: [
		importableYAML()
	]
})
