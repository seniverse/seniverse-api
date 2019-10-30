
export const compat = (data: {
  results: {
    location: object
    air: {
      city?: object
      stations?: object[]
    }
    last_update: string
  }[]
}) => data.results.map(result => ({
  location: result.location,
  data: [result.air],
  last_update: result.last_update
}))
