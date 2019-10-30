
export const compat = (data: {
  results: {
    location: object
    alarms: object[]
  }[]
}) => data.results.map(result => ({
  location: result.location,
  data: result.alarms,
}))
