
import * as request from 'request-promise'
import TpError from './error'
import logger from './logger'

export interface RequestOptions {
  method?: string
  url: string
  qs?: object
  body?: object
  headers?: object
  timeout?: number
}

const handleError = (err: Error, count: number, options: RequestOptions): Error => {
  logger.error(`[Retry-${count}] ${JSON.stringify(options)} - ${err.name} ${err.message}`)

  if (err['error']) {
    const statusCode = err['error'].status_code
    switch (statusCode) {
      // API 密钥 key 错误
      case 'AP010003':
      // 签名错误
      case 'AP010004':
      // 参数错误
      case 'AP010001':
      // JSONP 请求需要使用签名验证方式
      case 'AP010007':
      // 没有绑定域名
      case 'AP010008':
      // API 请求的 user-agent 与你设置的不一致
      case 'AP010009':
        throw new TpError.ServiceRequestError(err.message, {
          signal: statusCode
        })
      // 没有权限访问这个 API 接口
      case 'AP010002':
      // 没有权限访问这个地点
      case 'AP010006':
      // 你的服务已经过期
      case 'AP010012':
      // 访问量余额不足
      case 'AP010013':
      // 访问频率超过限制
      case 'AP010014':
        throw new TpError.ServicePermissionError(err.message, {
          signal: statusCode
        })
      // 系统内部错误：数据缺失
      case 'AP100001':
      // 系统内部错误：数据错误
      case 'AP100002':
      // 系统内部错误：服务内部错误
      case 'AP100003':
      // 系统内部错误：网关错误
      case 'AP100004':
        return new TpError.ServiceUnknownError(err.message, {
          signal: statusCode
        })
      // 没有这个地点
      case 'AP010010':
      // 无法查找到指定 IP 地址对应的城市
      case 'AP010011':
      // API 404, 你请求的 API 不存在
      case 'AP010005':
      // 暂不支持该城市的车辆限行信息
      case 'AP010015':
      // 暂不支持该城市的潮汐数据
      case 'AP010016':
      // 请求的坐标超出支持的范围
      case 'AP010017':
        throw new TpError.ServiceNotExistError(err.message, {
          signal: statusCode
        })
      default:
        break
    }
  }
  return err
}

/**
 * wrap origin request with retry strage supportting.
 * @param {Object} options option for origin request method.
 * @param {array[integer]} timeout timeout setting for every request.
 * @param {function} onError callback function if error.
 */
const retryRequest = async (
  options: RequestOptions,
  timeouts: number[]
): Promise<any> => {
  let err: Error
  for (let i = 0; i < timeouts.length; i += 1) {
    try {
      options.timeout = timeouts[i]
      return await request(options)
    } catch (e) {
      err = handleError(e, i, options)
    }
  }
  throw new TpError.RetryTimeoutError(err)
}

export default retryRequest
