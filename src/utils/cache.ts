
import * as cacheManager from 'cache-manager'
import logger from './logger'
import config from '../config'

const DEFAULT_TTL = config.seniverse.config.cache.ttl as number

const cacheConfig: cacheManager.StoreConfig = {
  store: 'memory',
  max: config.seniverse.config.cache.max,
  ttl: DEFAULT_TTL
}

let cache: cacheManager.Cache

export const initCache = (config: {
  max?: number
  ttl?: number | string
  enabled: boolean
} = { enabled: false }) => {
  const { enabled, ...others } = config
  if (!enabled) return

  Object.assign(cacheConfig, others)
  cache = cacheManager.caching(cacheConfig)
}

const getCacheKey = (args: any[]) => {
  let cacheKey = ''
  args.forEach((arg) => {
    if (Array.isArray(arg)) {
      cacheKey += `${arg.toString()}-`
    } else if (Object.prototype.toString.call(arg) === '[object Object]') {
      cacheKey += `${JSON.stringify(arg)}-`
    } else {
      cacheKey += `${arg}-`
    }
  })
  cacheKey = cacheKey.slice(0, -1)
  return cacheKey
}

export const wrapFn = (
  fn: (...args: any[]) => any,
  options: { prefix?: string }
) => {
  const { prefix = 'cache' } = options
  const finallyOptions = {
    ttl: cacheConfig.ttl as string | number
  }

  return (option: { ttl?: number, cacheKey?: string } = {}) => (...args: any[]) => {
    if (!cache) {
      return fn(...args)
    }

    let hitCache = true
    const tmpKey = option.cacheKey || getCacheKey(args)
    const fnCacheKey = `${prefix}-${fn.name}${tmpKey ? `-${tmpKey}` : ''}`

    if (option.ttl && finallyOptions.ttl === 'auto') finallyOptions.ttl = option.ttl
    if (finallyOptions.ttl === 'auto') finallyOptions.ttl = DEFAULT_TTL

    return cache.wrap(fnCacheKey, () => {
      hitCache = false
      return fn(...args)
    }, finallyOptions as cacheManager.CachingConfig).then((data) => {
      if (hitCache) {
        logger.debug(`[FUNC-CACHE:GET][${fnCacheKey}] - ${finallyOptions.ttl}`)
      } else {
        logger.debug(`[FUNC-CACHE:SET][${fnCacheKey}] - ${finallyOptions.ttl}`)
      }
      return data
    })
  }
}
