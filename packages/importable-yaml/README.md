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

## License

Code original to this project is licensed under the CC0-1.0 License.
