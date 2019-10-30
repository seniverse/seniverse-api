
export const compat = (data: {
  results: {
    location: object
    now: object
    last_update: string
  }[]
}) => data.results.map(result => ({
  location: result.location,
  data: [result.now],
  last_update: result.last_update
}))
