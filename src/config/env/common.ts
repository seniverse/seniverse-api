export default {
  logger: {
    appenders: {
      cheese: {
        type: 'console'
      }
    },
    categories: {
      default: {
        appenders: ['cheese'],
        level: 'debug'
      }
    }
  },
  seniverse: {
    url: 'https://api.seniverse.com',
    config: {
      encryption: {
        uid: process.env.SENIVERSE_UID,
        key: process.env.SENIVERSE_KEY,
        ttl: process.env.SENIVERSE_TTL,
        enabled: true
      },
      query: {
        timeouts: [3000, 5000, 7000],
        language: 'zh-Hans',
        location: 'beijing',
        unit: 'c'
      },
      returnRaw: false,
      cache: {
        enabled: false,
        max: 3000,
        ttl: 100
      }
    }
  }
}
