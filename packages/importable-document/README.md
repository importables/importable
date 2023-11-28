# @importable/document

**Importable Document** allows you to import documents with strong typing based on import attributes (_presently import assertions_).

```js
import document from './document.kdl' with { type: 'document', from: 'kdl' }

console.assert(doc.name === 'html')
console.assert(doc.children[1].name === 'body')

```

## Installation

```shell
npm install importable @importable/document
```

```js
{
  "compilerOptions": {
    "plugins": [
      {
        "name": "importable",
        "plugins": [
          "@importable/document"
        ]
      }
    ]
  }
}
```

## License

Code original to this project is licensed under the CC0-1.0 License.
