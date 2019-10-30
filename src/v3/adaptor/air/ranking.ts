
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
