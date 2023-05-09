/** @typedef {import('rollup').InputOptions} InputOptions */
/** @typedef {import('rollup').OutputOptions} OutputOptions */
/** @typedef {import('rollup').RollupWatchOptions} WatchOptions */

import { fileURLToPath } from 'node:url'
export { mkdir, rm, writeFile } from 'node:fs/promises'

export { rollup, watch } from 'rollup'

/** @type {{ <T extends InputOptions>(inputOptions: T): T }} */
export const defineInputOptions = (inputOptions) => inputOptions

/** @type {{ <T extends OutputOptions]>(...outputOptions: T[]): T[] }} */
export const defineOutputOptions = (...outputOptions) => outputOptions

/** @type {{ <T extends WatchOptions>(watchOptions: T): T }} */
export const defineWatchOptions = (watchOptions) => watchOptions

export const rootURL = new URL('../', import.meta.url)
export const getPath = (/** @type {string} */ pathName) => fileURLToPath(new URL(pathName, rootURL))
