# Importable

**Importable** allows you to import files with strong typing based on import attributes (_presently import assertions_).

```js
import config from './config.yml' assert { type: 'yaml' }

console.assert(config.doe === 'a deer, a female deer')
```

Internally, **Importable** treats import assertions as thought they are [import attributes](https://github.com/tc39/proposal-import-attributes),
in anticipation of the new import assertions syntax.

Once TypeScript supports import assertions, this plugin will provide an update to support the new syntax.

## Installation

```shell
npm install importable
```

```js
{
  "compilerOptions": {
    "plugins": [
      {
        "name": "importable",
        "plugins": []
      }
    ]
  }
}
```

## Plugins

- **[Importable Document](https://github.com/importables/importable/tree/main/packages/importable-document)** allows you to import documents from different files.
- **[Importable Machine](https://github.com/importables/importable/tree/main/packages/importable-machine)** allows you to import state machines from different files.
- **[Importable YAML](https://github.com/importables/importable/tree/main/packages/importable-yaml)** allows you to import data from YAML files.

## License

Code original to this project is licensed under the CC0-1.0 License.
