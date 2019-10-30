
/**
 * Abstract custom error, as parent class for all known errors.
 */
class TpError extends Error {
  origin: Error

  constructor(message?: string | Error) {
    if (message instanceof Error) {
      super(message.message)
      this.origin = message
    } else {
      super(message)
    }
  }
}

export const ERRORS = {
  SystemError: ['SYSTEM_ERROR'],
  // service
  RetryTimeoutError: ['RETRY_TIMEOUT'],
  RetryError: ['RETRY_ERROR'],
  ServiceUnknownError: ['SERVICE_UNKNOWN_ERROR'],
  ServiceTimeoutError: ['SERVICE_TIMEOUT_ERROR'],
  ServiceNotExistError: ['SERVICE_404_ERROR'],
  ServiceRequestError: ['SERVICE_REQUEST_ERROR'],
  ServicePermissionError: ['SERVICE_PERMISSION_ERROR'],
  UnhandleError: ['UNHANDLE_ERROR']
}

/**
 * @private
 * @param {String} errName subclass name of error
 * @param {String} errorCode, error code for end-user,
 */
function createError(errName: string) {
  const errorCode = ERRORS[errName][0]

  class NewError extends TpError {
    errName: string
    extra?: any
    signal?: string
    errorCode: string

    constructor(message, options: {
      extra?: any
      signal?: string
    } = {}) {
      super(message)
      this.extra = options.extra
      this.signal = options.signal
      this.errName = errName
      this.errorCode = errorCode
    }
  }

  return NewError
}

const attributeHandler = {
  get(_: any, errName: string) {
    if (!ERRORS[errName]) return Error
    return createError(errName)
  }
}

function target () {}
export default new Proxy(target, attributeHandler)
