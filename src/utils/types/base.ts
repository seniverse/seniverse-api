
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
}

export interface SeniverseConfig {
  uid?: string
  key?: string
  ttl?: number
  timeouts?: number[]
  language?: string
  cache?: Cache
  encryption?: boolean
}

interface Seniverse {
  url: string
  config: SeniverseConfig
}

export interface Config {
  logger: Logger
  seniverse: Seniverse
}
