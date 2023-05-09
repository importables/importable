import doc from './document.kdl' assert { type: 'document', from: 'kdl' }

console.assert(doc.name === 'html')
console.assert(doc.children[1].name === 'body')
