
export const compat = (data: {
  results: {
    location: object
    hourly: object[]
  }[]
}) => data.results.map(result => ({
  location: result.location,
  data: result.hourly
}))
