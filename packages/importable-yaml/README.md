# @importable/yaml

**Importable YAML** allows you to import YAML files with strong typing based on import attributes (_presently import assertions_).

```js
import config from './config.yml' assert { type: 'yaml' }

console.assert(config.doe === 'a deer, a female deer')
```

## Installation

```shell
npm install importable @importable/yaml
```

To support YAML from the TypeScript server,
add **@importable/yaml** to **tsconfig.json**:

```js
{
  "compilerOptions": {
    "plugins": [
      {
        "name": "importable",
        "plugins": [
          "@importable/yaml"
        ]
      }
    ]
  }
}
```

To support YAML within Vite,
add **@importable/yaml** to **vite.config.js**:

```js
import { defineConfig } from 'vite'
import importableYAML from '@importable/yaml/vite'

export default defineConfig({
  plugins: [
    importableYAML()
  ]
})
```

To support YAML within Astro,
add **@importable/yaml** to **astro.config.js**:

```js
import { defineConfig } from 'astro'
import importableYAML from '@importable/yaml/astro'

export default defineConfig({
  integrations: [
    importableYAML()
  ]
})
```

## License

Code original to this project is licensed under the CC0-1.0 License.
