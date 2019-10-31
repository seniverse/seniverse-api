
import * as merge from 'object-merge'
import config from '../config'
import { AttributeMissing } from '../utils/meta'
import { SeniverseConfig } from '../utils/types/base'
import logger from '../utils/logger'
import serviceUtils, { EncryptOptions, encrypt } from '../utils/service'
import { stringConvertToLowercase } from './utils'
import { SeniverseConfigSchema, EncryptSchema } from '../utils/constant/schema'
import TpError from '../utils/error'
import { initCache, wrapFn, CacheOptions } from '../utils/cache'
import { ADAPTORS, ADAPTOR_PREFIX } from './adaptor'
import { RequestOptions } from '../utils/request'

const DEFAULT_TTL = config.seniverse.config.cache.ttl as number

export class SeniverseV3 extends AttributeMissing {
  version: string = 'v3'
  options: SeniverseConfig
  fetchData: (cacheOptions: CacheOptions) =>
    (options: RequestOptions, encryptOptions: EncryptOptions, timeouts: number[]) => Promise<any>

  constructor(options: SeniverseConfig) {
    super()
    this.options = merge({}, config.seniverse.config, options) as SeniverseConfig
    const check = SeniverseConfigSchema.validate(this.options)
    if (check.error) throw new TpError.ConfigError(check.error)
    initCache(this.options.cache)

    const request = (options: any, encryption: any, timeouts?: number[]) =>
      serviceUtils.request(options, encryption, timeouts)

    this.fetchData = wrapFn(request, { prefix: this.version })
  }

  async request(path: string, qs: any) {
    const result = await this._request(path.split('/').filter(p => p), qs)
    return result
  }

  jsonp(path: string, qs: {
    encryption?: {
      ttl?: number
      uid?: string
      key?: string
    }
    query: {
      callback: string
      [key: string]: string
    }
  }) {
    const { encryption = {} } = qs
    const encryptOptions: EncryptOptions = Object.assign({}, this.options.encryption, {
      ...encryption,
      enabled: true
    })
    const check = EncryptSchema.validate(encryptOptions)
    if (check.error) throw new TpError.ConfigError(check.error)

    const { timeouts, ...baseQs } = this.options.query
    const query = Object.assign({}, encrypt(encryptOptions), baseQs, qs.query)
    const queryString = Object.keys(query).map(key => `${key}=${query[key]}`).join('&')

    return `${config.seniverse.url}/${this.version}/${path.split('/').filter(p => p).join('/')}.json?${queryString}`
  }

  private async _request(pathes: string[], qs: any) {
    const cacheKey = pathes.join('.')

    const { encryption, query, cache, returnRaw } = this.options
    const { timeouts, ...baseQs } = query

    const url = `${config.seniverse.url}/${this.version}/${pathes.join('/')}.json`
    logger.debug(`[url] ${url} - ${JSON.stringify(qs)}`)

    const option = {
      url,
      method: 'GET',
      qs: Object.assign({}, qs, baseQs)
    }

    const adaptorKey = Symbol.for(`${ADAPTOR_PREFIX}.${cacheKey}`)
    const adaptor = ADAPTORS.get(adaptorKey) || {}

    const fetch = this.fetchData({
      ttl: cache.ttl === 'auto'
        ? adaptor.TTL || DEFAULT_TTL
        : cache.ttl as number || DEFAULT_TTL,
      cacheKey: `${cacheKey}.${JSON.stringify(Object.assign({}, option.qs, encryption))}`
    })

    const result = await fetch(option, encryption, timeouts)
    if (!adaptor.compat || returnRaw) return result

    try {
      return adaptor.compat(result)
    } catch (e) {
      logger.error(e)
      return result
    }
  }

  attributeMissing(name: string) {
    const target = {
      pathes: [],
      data: async (qs: any) => {
        const pathes = target.pathes.map((path: string) => stringConvertToLowercase('_')(path))
        const result = await this._request(pathes, qs)
        return result
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
