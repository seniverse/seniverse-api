
import * as merge from 'object-merge'
import { Config } from '../utils/types/base'
import printer from '../utils/printer'

const env: string = process.env.NODE_ENV || 'local'

const common: Config = require('./env/common').default
let mergedConfig: Config

try {
  const config: Config = require(`./env/${env}`).default
  mergedConfig = merge({}, common, config, { env }) as Config
} catch (e) {
  mergedConfig = common
} finally {
  printer.print(mergedConfig)
}

export default mergedConfig
