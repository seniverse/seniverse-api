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
      uid: process.env.SENIVERSE_UID,
      key: process.env.SENIVERSE_KEY,
      ttl: process.env.SENIVERSE_TTL,
      timeouts: [3000, 5000, 7000],
      encryption: true
    }
  },
  cache: {
  }
}
