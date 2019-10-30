
export const compat = (data: {
  results: {
    location: object
    hourly_history: {
      city?: object
      stations?: object[]
    }[]
  }[]
}) => data.results.map(result => ({
  location: result.location,
  data: result.hourly_history,
}))
