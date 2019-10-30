
import * as merge from 'object-merge'
import config from '../config'
import { AttributeMissing } from '../utils/meta'
import { SeniverseConfig } from '../utils/types/base'
import { CACHE_TTL } from '../utils/constant/data'
import logger from '../utils/logger'
import serviceUtils from '../utils/service'
import { stringConvertToLowercase } from './utils'


class SeniverseV3 extends AttributeMissing {
  version: string = 'v3'
  options: SeniverseConfig

  constructor(options: SeniverseConfig = {}) {
    super()
    this.options = merge({}, config.seniverse.config, options)
  }

  attributeMissing(name: string) {

    const target = {
      pathes: [],
      data: async (qs: any) => {
        const pathes = target.pathes.map((path: string) => stringConvertToLowercase('_')(path))
        const cacheKey = pathes.join('.')
        const cacheTtl = CACHE_TTL[this.version.toUpperCase()][cacheKey] || 100

        const url = `${config.seniverse.url}/${this.version}/${pathes.join('/')}.json`
        logger.info(`[url] ${url} - ${JSON.stringify(qs)}`)

        const { uid, ttl, key, encryption, timeouts, ...baseQs } = this.options

        const options = {
          url,
          method: 'GET',
          qs: Object.assign({}, qs, baseQs)
        }
        const result = await serviceUtils.request(options, {
          uid,
          ttl,
          key,
          encryption
        }, timeouts)
        console.log(JSON.stringify(result))
      }
    }

    const handler = {
      get: function(target: any, property: string, receiver: any) {
        if (target[property]) return target[property]
        target.pathes.push(property)
        return receiver
      }
    }

    return new Proxy(target, handler)[name]
  }
}

export default SeniverseV3
