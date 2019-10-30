# Seniverse-API

> 心知天气 API Node.js（支持 Typescript）SDK

## Usage

```javascript
const seniverseV3 = new SeniverseV3({
  uid: '', // 公钥
  key: '', // 私钥
  ttl: '', // 签名失效时间
  language: '', // 结果返回语言
  location: '' // 地点
})

const data = await seniverseV3.weather.daily.data({ days: 2, start: -1, location: 'beijing' })
const data = await seniverseV3.air.hourlyHistory.data({ scope: 'city', location: 'beijing' })
const data = await seniverseV3.life.chineseCalendar.data({ days: 2, start: -1 })
const data = await seniverseV3.ocean.grid.hourly.data({ location: '30:109' })
```

## API

### 创建实例

```javascript
// 公钥、私钥: 文档 https://docs.seniverse.com/api/start/key.html
// ttl: 用于请求加密。文档：https://docs.seniverse.com/api/start/validation.html
// language: 结果返回语言，具体调用时可通过传入的参数更改。文档：https://docs.seniverse.com/api/start/language.html
// location: 请求地点，具体调用时可通过传入的参数更改。文档：https://docs.seniverse.com/api/start/common.html
const seniverseV3 = new SeniverseV3({
  uid: '', // 公钥
  key: '', // 私钥
  ttl: '', // 签名失效时间
  language: '', // 结果返回语言
  location: '' // 地点
})
```

### API 调用

首先需要了解心知天气 API 的 URL，可见文档：https://docs.seniverse.com/

通过 SDK 获取 API 数据时，需要根据该 API 的具体 URL 来进行调用，例如:

```javascript
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

### 数据返回

所有接口均以数组形式返回数据。相较于[原始 API 文档](https://docs.seniverse.com/)，返回的结果已经从`results`字段中抽出，并将具体数据封装进`data`（数组）字段，消除了原有 API 返回结果格式不统一的问题

## TODO

- 支持 JSONP
- 支持传入 URL 调用
- 支持直接返回原始数据
