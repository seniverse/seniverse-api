
import * as path from 'path'
import { shadowImport } from '../utils'

interface Adaptor {
  compat?: (...args: any[]) => any
  TTL?: number
}

export const ADAPTOR_PREFIX = __dirname.split('/').slice(-1)[0].toUpperCase()

export const ADAPTORS: Map<symbol, Adaptor> = shadowImport(
  __dirname,
  {
    excludes: [
      /\.map$/,
      path.resolve(__dirname, 'index.js')
    ],
    prefix: ADAPTOR_PREFIX,
    exportDefault: false,
    requiredExports: ['compat']
  }
)
