
import * as merge from 'object-merge'
import config from '../config'
import { AttributeMissing } from '../utils/meta'
import { SeniverseConfig } from '../utils/types/base'
import { CACHE_TTL } from '../utils/constant/data'
import logger from '../utils/logger'
import serviceUtils from '../utils/service'
import { stringConvertToLowercase } from './utils'
import { SeniverseConfigSchema } from '../utils/constant/schema'
import TpError from '../utils/error'
import { initCache, wrapFn } from '../utils/cache'
import { ADAPTORS, ADAPTOR_PREFIX } from './adaptor'

console.log(' ============================= ADAPTORS ============================= ')
console.log(ADAPTORS)

class SeniverseV3 extends AttributeMissing {
  version: string = 'v3'
  options: SeniverseConfig

  constructor(options: SeniverseConfig = {}) {
    super()
    this.options = merge({}, config.seniverse.config, options)
    const check = SeniverseConfigSchema.validate(this.options)
    if (check.error) throw new TpError.ConfigError(check.error)
    initCache(this.options.cache)
  }

  attributeMissing(name: string) {
    const request = (options: any, encryption: any, timeouts?: number[]) =>
      serviceUtils.request(options, encryption, timeouts)

    const fetchData = wrapFn(request, { prefix: this.version })

    const target = {
      pathes: [],
      data: async (qs: any) => {
        const pathes = target.pathes.map((path: string) => stringConvertToLowercase('_')(path))
        const cacheKey = pathes.join('.')
        const cacheTtl = CACHE_TTL[this.version.toUpperCase()][cacheKey] || 100

        const { uid, ttl, key, encryption, timeouts, ...baseQs } = this.options
        const url = `${config.seniverse.url}/${this.version}/${pathes.join('/')}.json`
        logger.info(`[url] ${url} - ${JSON.stringify(qs)}`)
        const options = {
          url,
          method: 'GET',
          qs: Object.assign({}, qs, baseQs)
        }
        const fetch = fetchData({
          ttl: cacheTtl,
          cacheKey: `${cacheKey}.${JSON.stringify(Object.assign({}, options.qs, {
            uid, ttl, key
          }))}`
        })

        const result = await fetch(options, {
          uid,
          ttl,
          key,
          encryption
        }, timeouts)

        const adaptorKey = Symbol.for(`${ADAPTOR_PREFIX}.${cacheKey}`)
        if (!ADAPTORS.has(adaptorKey)) return result

        try {
          const adaptor = ADAPTORS.get(adaptorKey)
          return adaptor.compat(result)
        } catch (e) {
          logger.error(e)
          return result
        }
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
