
export const compat = (data: {
  results: {
    location: object
    suggestion: object
    last_update: string
  }[]
}) => data.results.map(result => ({
  location: result.location,
  data: [result.suggestion],
  last_update: result.last_update
}))

export const TTL = 60 * 60
