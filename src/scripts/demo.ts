
import { SeniverseV3 } from '../v3'

const test = async () => {
  const seniverseV3 = new SeniverseV3({
    encryption: {
      uid: '',
      // add your api key
      key: '' || process.env.SENIVERSE_API_KEY,
      ttl: 10000,
      enabled: false
    },
    cache: {
      max: 1000,
      ttl: 'auto',
      enabled: true
    },
    query: {
      language: 'zh-Hans',
      timeouts: [3000, 3000]
    },
    returnRaw: false
  })

  let result: any
  result = await seniverseV3.weather.daily.data({ days: 2, start: -1, location: 'beijing' })
  console.log('\n============= result =============')
  console.log(JSON.stringify(result))
  console.log('\n')

  result = await seniverseV3.weather.now.data({ days: 2, start: -1, location: 'beijing' })
  console.log('\n============= result =============')
  console.log(JSON.stringify(result))
  console.log('\n')

  result = await seniverseV3.air.daily.data({ days: 2, start: -1, location: 'beijing' })
  console.log('\n============= result =============')
  console.log(JSON.stringify(result))
  console.log('\n')

  result = await seniverseV3.life.chineseCalendar.data({ days: 2, start: -1 })
  console.log('\n============= result =============')
  console.log(JSON.stringify(result))
  console.log('\n')

  // cached
  await seniverseV3.weather.daily.data({ days: 2, start: -1, location: 'beijing' })
  await seniverseV3.weather.now.data({ days: 2, start: -1, location: 'beijing' })
  await seniverseV3.air.daily.data({ days: 2, start: -1, location: 'beijing' })
  await seniverseV3.life.chineseCalendar.data({ days: 2, start: -1 })

  // use request api
  result = await seniverseV3.request(
    '/weather/daily',
    { days: 2, start: -1, location: 'beijing' }
  )
  console.log('\n============= result =============')
  console.log(JSON.stringify(result))
  console.log('\n')

  result = await seniverseV3.request(
    '/air/hourly_history',
    { scope: 'city', location: 'beijing' }
  )
  console.log('\n============= result =============')
  console.log(JSON.stringify(result))
  console.log('\n')

  // jsonp
  result = seniverseV3.jsonp(
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
  console.log('\n============= result =============')
  console.log(result)
  console.log('\n')

  process.exit(0)
}

test()
