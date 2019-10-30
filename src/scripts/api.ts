
import SeniverseV3 from '../v3'

const test = async () => {
  const seniverseV3: any = new SeniverseV3({
    uid: '',
    key: '',
    ttl: 10000,
    encryption: false
  })
  await seniverseV3.weather.daily.data({ days: 2, start: -1, location: 'beijing' })
  await seniverseV3.weather.now.data({ days: 2, start: -1, location: 'beijing' })
  await seniverseV3.air.daily.data({ days: 2, start: -1, location: 'beijing' })
  process.exit(0)
}

test()
