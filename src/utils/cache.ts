
import * as cacheManager from 'cache-manager'
import logger from './logger'

const cacheConfig = {
  store: 'memory',
  max: 3000,
  ttl: 300
}

const cache = cacheManager.caching(cacheConfig)

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

function wrapFn(fn, prefix = 'cache', options = {}) {
  const finallyOptions = {
    ttl: options['ttl'] || cacheConfig.ttl
  }

  return (ttl?: number) => (...args) => {
    let hitCache = true
    const tmpKey = getCacheKey(args)
    const cacheKey = `${prefix}-${fn.name}${tmpKey ? `-${tmpKey}` : ''}`

    if (ttl) finallyOptions.ttl = ttl

    return cache.wrap(cacheKey, () => {
      hitCache = false
      return fn(...args)
    }, finallyOptions).then((data) => {
      if (hitCache) {
        logger.info(`[FUNC-CACHE:GET][${cacheKey}] - ${finallyOptions.ttl}`)
      } else {
        logger.info(`[FUNC-CACHE:SET][${cacheKey}] - ${finallyOptions.ttl}`)
      }
      return data
    })
  }
}

export default {
  wrapFn
}
