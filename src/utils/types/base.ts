
interface Logger {
  readonly appenders: {
    readonly cheese: {
      readonly type: string
    }
  }
  readonly categories: {
    readonly default: {
      readonly appenders: string[],
      readonly level: string
    }
  }
}

interface Cache {
  max?: number
  ttl?: number | string
  enabled: boolean
}

interface Encryption {
  uid?: string // 公钥
  key: string // 私钥
  ttl?: number // 签名过期时间
  enabled: boolean // 调用时是否进行签名验证
}

export interface SeniverseConfig {
  encryption: Encryption
  query?: {
    timeouts?: number[]
    language?: string
    unit?: string
    location?: string
  }
  cache?: Cache // 缓存配置
  returnRaw?: boolean // 是否直接返回 API 原始数据
}

interface Seniverse {
  url: string
  config: SeniverseConfig
}

export interface Config {
  logger: Logger
  seniverse: Seniverse
}
