
import { SeniverseV3 } from '../v3'

const test = async () => {
  const seniverseV3: any = new SeniverseV3({
    uid: '',
    key: '',
    ttl: 10000,
    encryption: false,
    cache: {
      max: 1000,
      ttl: 'auto',
      enabled: true
    }
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

  await seniverseV3.weather.daily.data({ days: 2, start: -1, location: 'beijing' })
  await seniverseV3.weather.now.data({ days: 2, start: -1, location: 'beijing' })
  await seniverseV3.air.daily.data({ days: 2, start: -1, location: 'beijing' })
  await seniverseV3.life.chineseCalendar.data({ days: 2, start: -1 })

  process.exit(0)
}

test()
