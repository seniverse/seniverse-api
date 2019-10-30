
export const compat = (data: {
  results: {
    location: object
    hourly: object[]
    last_update: string
  }[]
}) => data.results.map(result => ({
  location: result.location,
  data: result.hourly,
  last_update: result.last_update,
}))
