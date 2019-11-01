# Seniverse-API

> 心知天气 API Node.js（支持 Typescript）SDK

[![npm version](https://badge.fury.io/js/seniverse-api.svg)](https://badge.fury.io/js/seniverse-api)  [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com) [![seniverse-api](http://img.shields.io/npm/dm/seniverse-api.svg)](https://www.npmjs.com/package/seniverse-api) ![Hex.pm](https://img.shields.io/hexpm/l/seniverse-api)

[![NPM](https://nodei.co/npm/seniverse-api.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/seniverse-api)


## Usage

```bash
$ npm i seniverse-api --save
```

```javascript
import { SeniverseV3 } from 'seniverse-api'

const seniverseV3 = new SeniverseV3({
  encryption: {
    uid: '', // 公钥
    key: '', // 私钥
    ttl: 10000, // 签名失效时间
    enabled: false // 是否进行签名验证
  },
  query: {
    unit: 'c', // 单位
    language: '', // 结果返回语言
    timeouts: [3000, 3000] // 重试次数和超时时间
  },
  // 内存缓存
  cache: {
    ttl: 100, // 缓存时间，单位为秒，可以为 'auto'
    max: 1000, // 缓存数据条数
    enabled: true // 是否开启缓存
  },
  returnRaw: false // 是否直接返回 API 原始数据
})

await seniverseV3.weather.daily.data({ days: 2, start: -1, location: 'beijing' })
await seniverseV3.air.hourlyHistory.data({ scope: 'city', location: 'beijing' })

// 通过 API URL 调用
await seniverseV3.request(
  '/weather/daily',
  { days: 2, start: -1, location: 'beijing' }
)

// 生成 jsonp 调用链接
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

### 创建实例

```javascript
import { SeniverseV3 } from 'seniverse-api'

const seniverseV3 = new SeniverseV3({
  // 内存缓存
  cache: {
    ttl: 100, // 缓存时间，单位为秒
    max: 1000, // 缓存数据条数
    enabled: true // 是否开启缓存
  },
  encryption: {
    uid: '', // 公钥
    key: '', // 私钥
    ttl: 100, // 签名失效时间，单位为秒
    enabled: true // 是否进行签名验证
  },
  query: {
    language: 'zh-Hans', // 结果返回语言，可在调用时修改
    location: 'beijing', // 地点，可在调用时修改
    unit: 'c', // 单位，可在调用时修改
    timeouts: [3000, 5000, 7000] // 调用 API 时重试次数以及 timeout 时间，单位为毫秒
  },
  returnRaw: false // 是否直接返回 API 原始数据
})
```

配置说明：

- `encryption`: API 加密/验证配置
  - `uid`: string, 公钥，文档 https://docs.seniverse.com/api/start/key.html
  - `key`: string, 私钥，文档 https://docs.seniverse.com/api/start/key.html
  - `ttl`: number, 加密过期时间，单位为秒，文档：https://docs.seniverse.com/api/start/validation.html
  - `enabled`: boolean, 是否开启加密，默认为`true`
- `cache`: 对请求结果进行内存缓存
  - `ttl`: number | string, 缓存时间，单位为秒；或设置为`auto`，将会根据不同 API 设定不同缓存时间（根据 API 更新频率）
  - `max`: number, 数据缓存量。超出将会覆盖旧缓存
  - `enabled`: boolean, 是否开启缓存。如果对数据时效性要求很高，则不建议开启缓存。默认为`false`
- `query`: 请求参数
  - `timeouts`: number[], 调用 API 时重试次数以及 timeout 时间，单位为毫秒。默认为`[3000, 5000, 7000]`
  - `language`: string, 结果返回语言，具体调用时可通过传入的参数更改。文档：https://docs.seniverse.com/api/start/language.html 默认为`zh-Hans`
  - `location`: string, 请求地点，具体调用时可通过传入的参数更改。文档：https://docs.seniverse.com/api/start/common.html
  - `unit`: string, 请求单位，具体调用时可通过传入的参数更改。文档：https://docs.seniverse.com/api/start/common.html 默认为`c`
- `returnRaw`: boolean, 是否直接返回 API 原始数据。默认为`false`

### API 调用

#### 数据调用方式一

首先需要了解心知天气 API 的 URL，可见文档：https://docs.seniverse.com/

通过 SDK 获取 API 数据时，需要根据该 API 的具体 URL 来进行调用，例如:

```javascript
import { SeniverseV3 } from 'seniverse-api'

const seniverseV3 = new SeniverseV3({ /* your config */ })

// 对于实况天气 API: https://api.seniverse.com/v3/weather/now.json
await seniverseV3.weather.now.data({
  location: 'beijing',
  language: 'zh-Hans',
  unit: 'c'
})

// 对于过去 24 小时历史空气 API：https://api.seniverse.com/v3/air/hourly_history.json
await seniverseV3.air.hourlyHistory.data({
  location: 'beijing',
  language: 'zh-Hans',
  scope: 'city'
})

// 对于农历节气 API：https://api.seniverse.com/v3/life/chinese_calendar.json
await seniverseV3.life.chineseCalendar.data({
  days: 2,
  start: 0
})
```

即，API 调用规律为，链式调用的方式将由 API URL 决定。如果 URL 内含有下划线`_`，则应转变为驼峰式写法：

```
/v3/weather/now.json => weather.now
/v3/air/hourly_history.json => air.hourlyHistory
/v3/life/chinese_calendar.json => life.chineseCalendar
```

#### 数据调用方式二

通过传入心知天气 API 的路由进行数据调用，更符合老用户的使用习惯

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

#### 生成 JSONP 链接

使用 JSONP 方式调用：[说明文档](https://docs.seniverse.com/api/start/jsonp.html)

```javascript
import { SeniverseV3 } from 'seniverse-api'

const seniverseV3 = new SeniverseV3({ /* your config */ })

// 生成 JSONP 链接调用 https://api.seniverse.com/v3/weather/daily.json
const url = seniverseV3.jsonp(
  '/weather/daily',
  {
    encryption: {
      ttl: 1000, // 加密过期时间，如在初始化中已经配置，则可不填
      uid: '', // 公钥，如在初始化中已经配置，则可不填
      key: '', // 私钥，如在初始化中已经配置，则可不填
    },
    query: {
      callback: 'weatherDaily', // 回调函数名
      location: 'beijing' // 请求参数
    }
  }
)

seniverseV3.jsonp(
  '/air/hourly',
  {
    // 如果 ttl, uid, key 都已在初始化时传递，则 encryption 字段可不传
    query: {
      callback: 'airHourly', // 回调函数名
      location: 'beijing' // 请求参数
    }
  }
)
```

### 数据返回

1. 如果没有设置`returnRaw: true`，则所有接口均以数组形式返回数据。相较于[原始 API 文档](https://docs.seniverse.com/)，返回的结果已经从`results`字段中抽出，并将具体数据封装进`data`（数组）字段，消除了原有 API 返回结果格式不统一的问题
2. 如果设置`returnRaw: true`，则返回结果将不做处理，和 API 文档展示的结果一致

## Demo

[使用样例](./src/scripts/demo.ts)

## License

[Apache License 2.0](./LICENSE)
