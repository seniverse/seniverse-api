
export const compat = (data: {
  results: {
    location: object
    aqi: string
  }[]
}) => data.results.map(result => ({
  location: result.location,
  data: [{
    aqi: result.aqi
  }]
}))

export const TTL = 60 * 60
