# @importable/machine

**Importable Machine** allows you to import state machines with strong typing based on import attributes (_presently import assertions_).

```js
import machine from './machines.css' assert { type: 'machine', from: 'css' }

machine.transition('active', 'toggle')

```

## Installation

```shell
npm install importable @importable/machine
```

```js
{
  "compilerOptions": {
    "plugins": [
      {
        "name": "importable",
        "plugins": [
          "@importable/machine"
        ]
      }
    ]
  }
}
```

## License

Code original to this project is licensed under the CC0-1.0 License.
