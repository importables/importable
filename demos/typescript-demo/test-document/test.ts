import doc from './document.kdl' with { type: 'document', from: 'kdl' }

console.assert(doc.name === 'html')
console.assert(doc.children[1].name === 'body')
