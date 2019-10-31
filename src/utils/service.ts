
import crypto = require('crypto')
import request, { RequestOptions } from './request'
import logger from './logger'

export interface EncryptOptions {
  uid?: string
  ttl?: number
  key: string
  enabled: boolean
}

const requestService = (
  options: RequestOptions,
  timeouts: number[]
) => request(
  options,
  timeouts
)

export const encrypt = (encryptOptions: EncryptOptions) => {
  if (!encryptOptions.enabled) {
    return {
      key: encryptOptions.key
    }
  }
  const ts = parseInt(`${(new Date()).getTime() / 1000}`, 10)
  const str = `ts=${ts}&ttl=${encryptOptions.ttl}&uid=${encryptOptions.uid}`

  return {
    ts,
    sig: crypto.createHmac('sha1', encryptOptions.key).update(
      new Buffer(str, 'utf-8')
    ).digest('base64'),
    ttl: encryptOptions.ttl,
    uid: encryptOptions.uid
  }
}

export default {
  request: (
    options: RequestOptions,
    encryptOptions: EncryptOptions,
    timeouts: number[] = [5000, 5000, 5000]
  ) => {
    if (!options.method) options.method = 'GET'
    options.qs = Object.assign({}, options.qs || {}, encrypt(encryptOptions))

    logger.debug(`[REQUEST] ${JSON.stringify(options)}`)
    return requestService(Object.assign({}, options, {
      json: true
    }), timeouts)
  }
}
