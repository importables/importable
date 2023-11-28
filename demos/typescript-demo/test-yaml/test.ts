import config from './config.yml' with { type: 'yaml' }

console.assert(config.doe === 'a deer, a female deer')
