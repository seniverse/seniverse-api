
import * as cacheManager from 'cache-manager'
import logger from './logger'

const cacheConfig = {
  store: 'memory',
  max: 3000,
  ttl: 300
}

let cache: cacheManager.Cache

export const initCache = (config: {
  max?: number
  ttl?: number
} = {}) => {
  Object.assign(cacheConfig, config)
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
  options: {
    prefix?: string
    ttl?: number
  } = {}
) => {
  const { prefix = 'cache', ttl = cacheConfig.ttl } = options
  const finallyOptions = {
    ttl
  }

  return (option: { ttl?: number, cacheKey?: string } = {}) => (...args: any[]) => {
    if (!cache) {
      return fn(...args)
    }

    let hitCache = true
    const tmpKey = option.cacheKey || getCacheKey(args)
    const fnCacheKey = `${prefix}-${fn.name}${tmpKey ? `-${tmpKey}` : ''}`

    if (option.ttl) finallyOptions.ttl = option.ttl

    return cache.wrap(fnCacheKey, () => {
      hitCache = false
      return fn(...args)
    }, finallyOptions).then((data) => {
      if (hitCache) {
        logger.debug(`[FUNC-CACHE:GET][${fnCacheKey}] - ${finallyOptions.ttl}`)
      } else {
        logger.debug(`[FUNC-CACHE:SET][${fnCacheKey}] - ${finallyOptions.ttl}`)
      }
      return data
    })
  }
}
