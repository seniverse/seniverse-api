# Seniverse-API

> 心知天气 API Node.js（Support Typescript）SDK [【语言--中文】](./README.md)

[![npm version](https://badge.fury.io/js/seniverse-api.svg)](https://badge.fury.io/js/seniverse-api)  [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com) [![seniverse-api](http://img.shields.io/npm/dm/seniverse-api.svg)](https://www.npmjs.com/package/seniverse-api) ![GitHub](https://img.shields.io/github/license/seniverse/seniverse-api)

[![NPM](https://nodei.co/npm/seniverse-api.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/seniverse-api)


## Usage

```bash
$ npm i seniverse-api --save
```

```javascript
import { SeniverseV3 } from 'seniverse-api'

const seniverseV3 = new SeniverseV3({
  encryption: {
    uid: '', // Public Key
    key: '', // Private Key
    ttl: 10000, // Signature expiration times
    enabled: false // Enable Signature verification or not
  },
  query: {
    unit: 'c', // Unit
    language: '', // Return language
    timeouts: [3000, 3000] // [retry times,overtime times]
  },
  // memory cache
  cache: {
    ttl: 100, // Cache time，unit is second，It can set as 'auto'
    max: 1000, // Numbers of cache data
    enabled: true // Enable open cache or not
  },
  returnRaw: false // Return directly the API's raw data or not
})

await seniverseV3.weather.daily.data({ days: 2, start: -1, location: 'beijing' })
await seniverseV3.air.hourlyHistory.data({ scope: 'city', location: 'beijing' })

// Called via API URL
await seniverseV3.request(
  '/weather/daily',
  { days: 2, start: -1, location: 'beijing' }
)

// Generate jsonp call the link
seniverseV3.jsonp(
  '/weather/daily',
  {
    encryption: {
      ttl: 1000,
      uid: '',
      key: '',
    },
    query: {
      callback: 'weatherDaily',
      location: 'beijing'
    }
  }
)
```

## API

### Create instance

```javascript
import { SeniverseV3 } from 'seniverse-api'

const seniverseV3 = new SeniverseV3({
  // Memory cache
  cache: {
    ttl: 100, // Cache time, unit is second
    max: 1000, // Numbers of cache data
    enabled: true // Enable open cache or not
  },
  encryption: {
    uid: '', // public key
    key: '', // private key
    ttl: 100, // Signature expiration times, unit is second
    enabled: true // Enable Signature verification or not
  },
  query: {
    language: 'zh-Hans', // Return language, can change in calling
    location: 'beijing', // Position, can change in calling
    unit: 'c', // Unit, can change in calling
    timeouts: [3000, 5000, 7000] // Numbers of retry and overtime times, unit is millisecond
  },
  returnRaw: false // Return directly the API's raw data or not
})
```

配置说明：

- `encryption`: API Encryption/verification configuration
  - `uid`: string, public key, doc: https://docs.seniverse.com/api/start/key.html
  - `key`: string, Private key, doc: https://docs.seniverse.com/api/start/key.html
  - `ttl`: number, Encryption expiration times, unit is second, doc：https://docs.seniverse.com/api/start/validation.html
  - `enabled`: boolean, Encryption or not，default is `true`
- `cache`: Memory cache for request result
  - `ttl`: number | string, Cache times，unit is second；or set as `auto`, Different cache times will be set according to different APIs（According to API update frequency）
  - `max`: number, Data buffer. Overflow will overwrite old cache.
  - `enabled`: boolean, Open cache or not. If the timeliness of the data is very high, it is not recommended to enable the cache. default is `false`
- `query`: Request parameter
  - `timeouts`: number[], Numbers of retry and overtime times, unit is millisecond. default is `[3000, 5000, 7000]`
  - `language`: string, Return language, can changed by passed parameters in calling.doc：https://docs.seniverse.com/api/start/language.html default is `zh-Hans`
  - `location`: string, Request position, can changed by passed parameters in calling.doc：https://docs.seniverse.com/api/start/common.html
  - `unit`: string, Request unit，can changed by passed parameters in calling.doc：https://docs.seniverse.com/api/start/common.html default is `c`
- `returnRaw`: boolean, Return directly the API's raw data or not. default is`false`

### API Call

#### Data calling method One

First know the 心知天气API's URL，doc：https://docs.seniverse.com/

When getting API data through the SDK, you need to call it based on the specific URL of the API, 
for example:

```javascript
import { SeniverseV3 } from 'seniverse-api'

const seniverseV3 = new SeniverseV3({ /* your config */ })

// to real wheather API: https://api.seniverse.com/v3/weather/now.json
await seniverseV3.weather.now.data({
  location: 'beijing',
  language: 'zh-Hans',
  unit: 'c'
})

// to weather for past 24 hours API：https://api.seniverse.com/v3/air/hourly_history.json
await seniverseV3.air.hourlyHistory.data({
  location: 'beijing',
  language: 'zh-Hans',
  scope: 'city'
})

// For the lunar calendar API：https://api.seniverse.com/v3/life/chinese_calendar.json
await seniverseV3.life.chineseCalendar.data({
  days: 2,
  start: 0
})
```

That is, the API call rule is that the way the chain is called will be determined by the API URL. 
If the URL contains an underscore `_`, it should be converted to a camel style:

```
/v3/weather/now.json => weather.now
/v3/air/hourly_history.json => air.hourlyHistory
/v3/life/chinese_calendar.json => life.chineseCalendar
```

#### Data calling method Two

Data calls are made through the route of the known weather API, which is more in line with the old user's usage habits.

```javascript
import { SeniverseV3 } from 'seniverse-api'

const seniverseV3 = new SeniverseV3({ /* your config */ })

// 调用 https://api.seniverse.com/v3/weather/daily.json
await seniverseV3.request(
  '/weather/daily',
  { days: 2, start: -1, location: 'beijing' }
)

// 调用 https://api.seniverse.com/v3/air/hourly_history.json
await seniverseV3.request(
  '/air/hourly_history',
  { scope: 'city', location: 'beijing' }
)
```

#### Generate JSONP link

Use JSONP method call：[description doc](https://docs.seniverse.com/api/start/jsonp.html)

```javascript
import { SeniverseV3 } from 'seniverse-api'

const seniverseV3 = new SeniverseV3({ /* your config */ })

// Generate JSONP link call https://api.seniverse.com/v3/weather/daily.json
const url = seniverseV3.jsonp(
  '/weather/daily',
  {
    encryption: {
      ttl: 1000, // Encryption expiration time, if configured during initialization, you can leave it blank
      uid: '', // The public key, if configured during initialization, can be leave blank
      key: '', // The private key, if configured during initialization, can be leave blank
    },
    query: {
      callback: 'weatherDaily', // Callback function name
      location: 'beijing' // Request parameter
    }
  }
)

seniverseV3.jsonp(
  '/air/hourly',
  {
    // If ttl, uid, key are passed at initialization, the encryption field can be leave blank
    query: {
      callback: 'airHourly', // Callback function name
      location: 'beijing' // Request parameter
    }
  }
)
```

### Data return

Determine whether to return the original data by setting `returnRaw` when initializing `SeniverseV3`.(that is the same data as in the API document)

1. If `returnRaw: false`, all interfaces return data as an array. Compare with [Raw API doc](https://docs.seniverse.com/), The returned result has been extracted from the `results` field, and the specific data is encapsulated into the `data` (array) field, eliminating the problem that the original API returns the result format is not uniform.
2. If `returnRaw: true`, the returned result will not be processed, consistent with the results shown in the API documentation.

## Demo

[Use Demo](./src/scripts/demo.ts)

## License

[MIT License](./LICENSE)
