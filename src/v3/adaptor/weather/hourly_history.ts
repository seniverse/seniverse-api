
export const compat = (data: {
  results: {
    location: object
    hourly_history: object[]
  }[]
}) => data.results.map(result => ({
  location: result.location,
  data: result.hourly_history,
}))
