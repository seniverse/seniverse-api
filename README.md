# Seniverse-API

```javascript
const seniverseV3 = new SeniverseV3({
  uid: '',
  key: '',
  ttl: '',
  language: '',
  location: ''
})

const data = await seniverseV3.weather.daily.data({ days: 2, start: -1, location: 'beijing' })
const data = await seniverseV3.air.hourlyHistory.data({ scope: 'city', location: 'beijing' })
const data = await seniverseV3.life.chineseCalendar.data({ days: 2, start: -1 })
const data = await seniverseV3.ocean.grid.hourly.data({ location: '' })
```
